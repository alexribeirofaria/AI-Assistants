from collections.abc import Callable, Mapping
from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy
from application.strategies.claude_strategy import ClaudeStrategy
from application.strategies.gemini_strategy import GeminiStrategy
from application.strategies.groq_strategy import GroqStrategy
from application.strategies.openai_strategy import OpenAIStrategy

class  StrategyApplicationFactory:
    def __init__(
        self,
        creators: Mapping[str, Callable[[], BaseApplicationStrategy]] | None = None,
        default_strategy_name: str = "groq",
    ) -> None:
        self._creators: dict[str, Callable[[], BaseApplicationStrategy]] = dict(creators) if creators else {
            "claude": ClaudeStrategy,
            "openai": OpenAIStrategy,
            "gemini": GeminiStrategy,
            "groq": GroqStrategy,
        }
        self._default_strategy_name = self._normalize_name(default_strategy_name)

        if self._default_strategy_name not in self._creators:
            raise ValueError("A strategy padrão precisa existir no catálogo")

    def register(self, name: str, creator: Callable[[], BaseApplicationStrategy]) -> None:
        normalized = self._normalize_name(name)
        self._creators[normalized] = creator

    def create(self, name: str | None) -> BaseApplicationStrategy:
        creator = self.get_creator(name)
        return creator()

    def get_creator(self, name: str | None) -> Callable[[], BaseApplicationStrategy]:
        normalized = self._normalize_name(name)
        return self._creators.get(normalized, self._creators[self._default_strategy_name])

    def available_names(self) -> tuple[str, ...]:
        return tuple(sorted(self._creators.keys()))

    @property
    def default_strategy_name(self) -> str:
        return self._default_strategy_name

    @staticmethod
    def _normalize_name(name: str | None) -> str:
        return (name or "").strip().lower()

    def get_strategy(self, name: str | None) -> BaseApplicationStrategy:
        creator = self.get_creator(name)
        return creator()