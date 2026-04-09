from collections.abc import Callable, Mapping
from enum import Enum
from application.strategies.langchain_strategy import LangChainStrategy
from domain.abstracts.domain_type import DomainType
from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy
from application.strategies.claude_strategy import ClaudeStrategy
from application.strategies.gemini_strategy import GeminiStrategy
from application.strategies.groq_strategy import GroqStrategy
from application.strategies.openai_strategy import OpenAIStrategy

class StrategyApplicationFactory:
    
    @property
    def default(self) -> DomainType:
        return self._default
    def __init__(self,
        creators: Mapping[DomainType, Callable[[], BaseApplicationStrategy]] | None = None,
        default: DomainType = DomainType.Groq) -> None:

        self._creators: dict[DomainType, Callable[[], BaseApplicationStrategy]] = dict(creators) if creators else {
            DomainType.Claude: ClaudeStrategy,
            DomainType.OpenAI: OpenAIStrategy,
            DomainType.Gemini: GeminiStrategy,
            DomainType.Groq: GroqStrategy,
            DomainType.LangChain: LangChainStrategy
        }

        self._default = default

        if self._default not in self._creators:
            raise ValueError("A strategy padrão precisa existir no catálogo")

    def _parse_domain(self, name: str | DomainType | None) -> DomainType:
        # Já é DomainType → retorna direto (fast path)
        if isinstance(name, DomainType):
            return name

        # None ou vazio → default
        if not name:
            return self._default

        normalized = name.strip().lower().replace(" ", "")

        for domain in self._creators:
            enum_name = domain.name.lower()
            enum_value = domain.value.lower().replace(" ", "")

            if normalized in (enum_name, enum_value):
                return domain

        return self._default   
    
    def register(self,
        domain: DomainType,
        creator: Callable[[], BaseApplicationStrategy]) -> None:
        self._creators[domain] = creator

    def create(self, 
        domain: DomainType) -> BaseApplicationStrategy:
        return self._resolve_creator(domain)()

    def _resolve_creator(self,
        domain: DomainType) -> Callable[[], BaseApplicationStrategy]:
        return self._creators.get(domain, self._creators[self._default])

    def available(self) -> tuple[Enum, ...]:
        return tuple(self._creators.keys())
    
    def get_strategy(self,
        name: str | None) -> BaseApplicationStrategy:
        creator = self.get_creator(name)
        return creator()    

    def get_creator(self, name: str | None) -> Callable[[], BaseApplicationStrategy]:
        return self._resolve_creator(self._parse_domain(name))