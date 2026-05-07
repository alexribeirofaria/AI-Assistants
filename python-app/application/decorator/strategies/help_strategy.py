from collections.abc import Sequence
from application.enums.user_action import UserAction
from application.decorator.helpers.decorator_text_helper import DecoratorTextHelper
from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy
from application.decorator.strategies.decorator.decorator_helper_strategy import strategy

@strategy(priority=5)
class HelpStrategy(BaseHelperStrategy):
    _PHRASES = ["help", "ajuda", "comandos"]

    def can_handle(self, normalized: str, tokens: Sequence[str]) -> bool:
        return DecoratorTextHelper.best_match(normalized, self._PHRASES, 0.75) is not None

    def handle(self, normalized: str, tokens: Sequence[str]):
        return UserAction.MESSAGE, "help"
