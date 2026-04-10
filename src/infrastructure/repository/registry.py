from collections.abc import Callable, Mapping
from domain.abstracts.base_domain import BaseDomain
from infrastructure.repository.builder import Builder
from infrastructure.repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class Registry:

    @property
    def default_domain(self) -> type[BaseDomain]:
        return self._default_domain

    def __init__(self,
        factories: Mapping[type[BaseDomain], Callable[[], BaseRepositoryStrategy]] | None = None,
        default_domain: type[BaseDomain] | None = None,
    ):

        self._factories: dict[type[BaseDomain], Callable[[], BaseRepositoryStrategy]] = (
            dict(factories) if factories else self._build_default_factories()
        )

        self._default_domain = default_domain or next(iter(self._factories))
        if self._default_domain not in self._factories:
            raise ValueError("Default domain must exist in registry") 

    def create(self, domain: type[BaseDomain]) -> BaseRepositoryStrategy:
        return self.get_factory(domain)()

    def get_factory(self, domain: type[BaseDomain]) -> Callable[[], BaseRepositoryStrategy]:
        resolved = domain or self.default_domain        
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

    @staticmethod
    def _build_default_factories() -> dict[type[BaseDomain], Callable[[], BaseRepositoryStrategy]]:
        from domain.openai_domain import OpenAI
        from domain.claude_domain import Claude
        from domain.gemini_domain import Gemini
        from domain.groq_domain import Groq
        from domain.langchain_domain import LangChain
        
        from infrastructure.servers.openai_server import OpenAIServer
        from infrastructure.servers.claude_server import ClaudeServer
        from infrastructure.servers.gemini_server import GeminiServer
        from infrastructure.servers.groq_server import GroqServer
        from infrastructure.servers.langchain_server import LangChainServer

        return {
            Claude: lambda: Builder(ClaudeServer().load_server(), Claude),
            OpenAI: lambda: Builder(OpenAIServer().load_server(), OpenAI),
            Gemini: lambda: Builder(GeminiServer().load_server(), Gemini),
            Groq: lambda: Builder(GroqServer().load_server(), Groq),
            LangChain: lambda: Builder(LangChainServer().load_server(), LangChain),
        }