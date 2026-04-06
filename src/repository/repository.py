from typing import Mapping
from domain.abstracts.base_domain import BaseDomain
from repository.registry import Registry
from repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class Repository:
    def __init__(
        self,
        providers: Mapping[str, BaseRepositoryStrategy] | None = None,
        default_provider: str | None = None,
        provider_registry: Registry | None = None,
    ):
        self._providers: dict[str, BaseRepositoryStrategy] = (
            dict(providers) if providers else {}
        )
        self._provider_registry = provider_registry or Registry()
        self._default_provider = (
            default_provider or self._provider_registry.default_provider_name
        ).strip().lower() or self._provider_registry.default_provider_name

    def available_providers(self) -> tuple[str, ...]:
        names = set(self._provider_registry.available_provider_names()) | set(
            self._providers.keys()
        )
        return tuple(sorted(names))

    def register_provider(self, name: str, provider: BaseRepositoryStrategy) -> None:
        normalized = name.strip().lower()
        if not normalized:
            raise ValueError("Provider name inválido")
        self._providers[normalized] = provider

    def _get_provider(self, provider_name: str) -> BaseRepositoryStrategy:
        normalized = provider_name.strip().lower()

        if normalized in self._providers:
            return self._providers[normalized]

        if not self._provider_registry.has_provider(normalized):
            available = ", ".join(self.available_providers())
            raise KeyError(
                f"Provider desconhecido: {normalized}. Disponíveis: {available}"
            )

        provider = self._provider_registry.create(normalized)
        self._providers[normalized] = provider
        return provider

    def get_domain(self, domain_type: str) -> BaseDomain:
        """Retorna o modelo apropriado de acordo com a string passada."""
        normalized = (domain_type or "").strip().lower()
        provider_name = (
            normalized
            if (
                normalized in self._providers
                or self._provider_registry.has_provider(normalized)
            )
            else self._default_provider
        )
        return self._get_provider(provider_name).build_domain()