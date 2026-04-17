from collections.abc import Callable, Mapping
from application.strategies.abstracts.base_application_strategy import (
    BaseApplicationStrategy,
)
from application.strategies.claude_strategy import ClaudeStrategy
from application.strategies.gemini_strategy import GeminiStrategy
from application.strategies.groq_strategy import GroqStrategy
from application.strategies.langchain_strategy import LangChainStrategy
from application.strategies.openai_strategy import OpenAIStrategy
from domain.abstracts.base_domain import BaseDomain
from domain.claude_domain import Claude
from domain.gemini_domain import Gemini
from domain.groq_domain import Groq
from domain.langchain_domain import LangChain
from domain.openai_domain import OpenAI


class StrategyApplicationFactory:
    def __init__(
        self,
        creators: (
            Mapping[type[BaseDomain], Callable[[], BaseApplicationStrategy]] | None
        ) = None,
        default_domain: type[BaseDomain] = Groq,
    ) -> None:
        self._creators: dict[
            type[BaseDomain], Callable[[], BaseApplicationStrategy]
        ] = (
            dict(creators)
            if creators
            else {
                Groq: GroqStrategy,
                Gemini: GeminiStrategy,
                OpenAI: OpenAIStrategy,
                Claude: ClaudeStrategy,
                LangChain: LangChainStrategy,
            }
        )
        self._default_domain = default_domain

        if self._default_domain not in self._creators:
            raise ValueError("A strategy padrão precisa existir no catálogo")

    @property
    def default_domain(self) -> type[BaseDomain]:
        return self._default_domain

    @staticmethod
    def _sanitize(value: str) -> str:
        return value.strip().lower().replace("_", "").replace(" ", "")

    def parse_domain(
        self, value: str | type[BaseDomain] | None
    ) -> type[BaseDomain] | None:
        if value is None:
            return None

        if isinstance(value, type) and issubclass(value, BaseDomain):
            return value if value in self._creators else None

        normalized = self._sanitize(value)
        for domain in self._creators:
            aliases = {
                self._sanitize(domain.__name__),
                self._sanitize(domain.get_domain_name()),
            }
            if normalized in aliases:
                return domain

        return None

    def _parse_or_default(
        self, value: str | type[BaseDomain] | None
    ) -> type[BaseDomain]:
        return self.parse_domain(value) or self._default_domain

    def register(
        self,
        domain: type[BaseDomain],
        creator: Callable[[], BaseApplicationStrategy],
    ) -> None:
        self._creators[domain] = creator

    def create(self, domain: type[BaseDomain]) -> BaseApplicationStrategy:
        return self._resolve_creator(domain)()

    def _resolve_creator(
        self, domain: type[BaseDomain]
    ) -> Callable[[], BaseApplicationStrategy]:
        return self._creators.get(domain, self._creators[self._default_domain])

    def available(self) -> tuple[type[BaseDomain], ...]:
        return tuple(self._creators.keys())

    def get_strategy(
        self, value: str | type[BaseDomain] | None
    ) -> BaseApplicationStrategy:
        return self.get_creator(value)()

    def get_creator(
        self, value: str | type[BaseDomain] | None
    ) -> Callable[[], BaseApplicationStrategy]:
        return self._resolve_creator(self._parse_or_default(value))
