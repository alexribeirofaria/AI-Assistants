from collections.abc import Callable, Mapping
from domain.openai_domain import OpenAI
from domain.claude_domain import Claude
from domain.gemini_domain import Gemini
from domain.groq_domain import Groq
from infrastructure.clients.claude_client import ClaudeClient
from infrastructure.clients.gemini_client import GeminiClient
from infrastructure.clients.groq_client import GroqClient
from infrastructure.clients.openai_client import OpenAIClient
from repository.builder import Builder
from repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class Registry:
    def __init__(
        self,
        factories: Mapping[str, Callable[[], BaseRepositoryStrategy]] | None = None,
        default_provider_name: str = "groq",
    ) -> None:
        self._factories: dict[str, Callable[[], BaseRepositoryStrategy]] = (
            dict(factories) if factories else self._build_default_factories()
        )
        self._default_provider_name = self._normalize_name(default_provider_name) or "claude"

        if self._default_provider_name not in self._factories:
            raise ValueError("O provider padrão precisa existir no registry")

    def create(self, provider_name: str | None) -> BaseRepositoryStrategy:
        factory = self.get_factory(provider_name)
        return factory()

    def get_factory(self, provider_name: str | None) -> Callable[[], BaseRepositoryStrategy]:
        normalized = self._normalize_name(provider_name)
        return self._factories.get(normalized, self._factories[self._default_provider_name])

    def has_provider(self, provider_name: str | None) -> bool:
        normalized = self._normalize_name(provider_name)
        return normalized in self._factories

    def available_provider_names(self) -> tuple[str, ...]:
        return tuple(sorted(self._factories.keys()))

    def register(
        self,
        provider_name: str,
        factory: Callable[[], BaseRepositoryStrategy],
    ) -> None:
        normalized = self._normalize_name(provider_name)
        if not normalized:
            raise ValueError("Provider name inválido")
        self._factories[normalized] = factory

    @property
    def default_provider_name(self) -> str:
        return self._default_provider_name

    @staticmethod
    def _normalize_name(provider_name: str | None) -> str:
        return (provider_name or "").strip().lower()

    @staticmethod
    def _build_default_factories() -> dict[str, Callable[[], BaseRepositoryStrategy]]:
        return {
            "claude": lambda: Builder(ClaudeClient().load_client(), Claude),
            "openai": lambda: Builder(OpenAIClient().load_client(), OpenAI),
            "gemini": lambda: Builder(GeminiClient().load_client(), Gemini),
            "groq": lambda: Builder(GroqClient().load_client(), Groq),
        }
        
        
        
