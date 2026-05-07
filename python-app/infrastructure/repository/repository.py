from typing import Mapping
from domain.abstracts.base_domain import BaseDomain
from infrastructure.repository.registry import Registry
from infrastructure.repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class Repository:

    def __init__(self,
        providers: Mapping[type[BaseDomain], BaseRepositoryStrategy] | None = None,
        default_domain: type[BaseDomain] | None = None,
        registry: Registry | None = None,
    ):
        self._providers: dict[str, BaseRepositoryStrategy] = {}
        if providers:
            for k, v in providers.items():
                key = k.__name__ if isinstance(k, type) else str(k)
                self._providers[key] = v
        self._registry: Registry = registry or Registry()
        self._default_domain = default_domain or self._registry.default_domain

    # ----------------- PUBLIC -----------------

    def available_domains(self) -> tuple[str, ...]:
        names = set(self._registry.available_domains()) | {d.__name__ for d in self._providers.keys()}
        return tuple(names)

    def register(self, domain: str | type[BaseDomain], provider: BaseRepositoryStrategy) -> None:
        key = domain.__name__ if isinstance(domain, type) else domain
        self._providers[key] = provider

    def build_domain(self, domain: type[BaseDomain]) -> BaseDomain:
        strategy = self._get_provider(domain)
        return strategy.build_domain()

    # ----------------- INTERNAL -----------------

    def _get_provider(self, domain: type[BaseDomain]) -> BaseRepositoryStrategy:
        resolved = domain or self._default_domain
        name = resolved.__name__ if isinstance(resolved, type) else resolved

        # já instanciado
        if name in self._providers:
            return self._providers[name]

        # precisa criar via registry
        if not self._registry.has_domain(name):
            available = ", ".join(self.available_domains())
            raise KeyError(
                f"Domain desconhecido: {name}. Disponíveis: {available}"
            )

        provider = self._registry.create(name)
        self._providers[name] = provider
        return provider
