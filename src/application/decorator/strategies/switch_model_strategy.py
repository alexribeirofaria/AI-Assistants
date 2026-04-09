from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy
from application.decorator.strategies.decorator.decorator_helper_strategy import strategy
from application.enums.user_action import UserAction
from application.helpers.abstracts.base_helper import BaseHelper
from domain.abstracts.domain_type import DomainType

@strategy(priority=15)
class SwitchModelStrategy(BaseHelperStrategy):
    _PHRASES = ["claude", "openai", "gemini", "groq"]

    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        candidate = self._normalize_name(normalized)
        phrases = [BaseHelper.normalize_text(p).replace(" ", "") for p in self._PHRASES]
        return BaseHelper.best_match(candidate, phrases, 0.70) is not None

    def handle(self, normalized: str, tokens: list[str]):
        provider = self._normalize_name(BaseHelper.best_match(tokens[0], self._PHRASES, 0.75))
        return UserAction.SWITCH_MODEL, provider
    
    @staticmethod
    def _normalize_name(name: str | DomainType | None) -> str:
        if isinstance(name, DomainType):
            name = name.value

        return (name or "").strip().lower()