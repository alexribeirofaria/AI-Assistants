from typing import Mapping
from domain.abstracts.base_domain import BaseDomain
from repository.registry import Registry
from repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class Repository:

    def __init__(
        self,
        providers: Mapping[type[BaseDomain], BaseRepositoryStrategy] | None = None,
        default_domain: type[BaseDomain] | None = None,
        registry: Registry | None = None,
    ):
        self._providers: dict[type[BaseDomain], BaseRepositoryStrategy] = (
            dict(providers) if providers else {}
        )

        self._registry = registry or Registry()
        self._default_domain = default_domain or self._registry.default_domain

    # ----------------- PUBLIC -----------------

    def available_domains(self) -> tuple[type[BaseDomain], ...]:
        names = set(self._registry.available_domains()) | set(self._providers.keys())
        return tuple(names)

    def register(self, domain: type[BaseDomain], provider: BaseRepositoryStrategy) -> None:
        self._providers[domain] = provider

    def build_domain(self, domain: type[BaseDomain] | None) -> BaseDomain:
        strategy = self._get_provider(domain)
        return strategy.build_domain()

    # ----------------- INTERNAL -----------------

    def _get_provider(self, domain: type[BaseDomain] | None) -> BaseRepositoryStrategy:
        resolved = domain or self._default_domain

        # já instanciado
        if resolved in self._providers:
            return self._providers[resolved]

        # precisa criar via registry
        if not self._registry.has_domain(resolved):
            available = ", ".join(d.__name__ for d in self.available_domains())
            raise KeyError(
                f"Domain desconhecido: {resolved.__name__}. Disponíveis: {available}"
            )

        provider = self._registry.create(resolved)
        self._providers[resolved] = provider
        return provider