from collections.abc import Sequence
from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy
from application.decorator.strategies.decorator.decorator_helper_strategy import strategy
from application.enums.user_action import UserAction

@strategy(priority=10)
class ClearStrategy(BaseHelperStrategy):
    _PHRASES = ["cls", "clear"]

    def can_handle(self, normalized: str, tokens: Sequence[str]) -> bool:
        return normalized.replace(" ", "") in self._PHRASES

    def handle(self, normalized: str, tokens: Sequence[str]):
        return UserAction.CLEAR, None
