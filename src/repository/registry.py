from collections.abc import Callable, Mapping
from domain.abstracts.base_domain import BaseDomain
from repository.builder import Builder
from repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class Registry:

    def __init__(
        self,
        factories: Mapping[type[BaseDomain], Callable[[], BaseRepositoryStrategy]] | None = None,
        default_domain: type[BaseDomain] | None = None,
    ) -> None:

        self._factories: dict[type[BaseDomain], Callable[[], BaseRepositoryStrategy]] = (
            dict(factories) if factories else self._build_default_factories()
        )

        self._default_domain = default_domain or next(iter(self._factories))

        if self._default_domain not in self._factories:
            raise ValueError("O domínio padrão precisa existir no registry")

    def create(self, domain: type[BaseDomain] | None) -> BaseRepositoryStrategy:
        return self.get_factory(domain)()

    def get_factory(self, domain: type[BaseDomain] | None) -> Callable[[], BaseRepositoryStrategy]:
        resolved = domain or self._default_domain        
        if resolved not in self._factories:
            raise ValueError(f"Domain não registrado: {resolved.__name__}")
        return self._factories[resolved]
        
    def has_domain(self, domain: type[BaseDomain]) -> bool:
        return domain in self._factories

    def available_domains(self) -> tuple[type[BaseDomain], ...]:
        return tuple(self._factories.keys())

    def register(
        self,
        domain: type[BaseDomain],
        factory: Callable[[], BaseRepositoryStrategy]) -> None:
        self._factories[domain] = factory

    @property
    def default_domain(self) -> type[BaseDomain]:
        return self._default_domain

    @staticmethod
    def _build_default_factories() -> dict[type[BaseDomain], Callable[[], BaseRepositoryStrategy]]:
        from domain.openai_domain import OpenAI
        from domain.claude_domain import Claude
        from domain.gemini_domain import Gemini
        from domain.groq_domain import Groq

        from infrastructure.clients.openai_client import OpenAIClient
        from infrastructure.clients.claude_client import ClaudeClient
        from infrastructure.clients.gemini_client import GeminiClient
        from infrastructure.clients.groq_client import GroqClient

        return {
            Claude: lambda: Builder(ClaudeClient().load_client(), Claude),
            OpenAI: lambda: Builder(OpenAIClient().load_client(), OpenAI),
            Gemini: lambda: Builder(GeminiClient().load_client(), Gemini),
            Groq: lambda: Builder(GroqClient().load_client(), Groq),
        }