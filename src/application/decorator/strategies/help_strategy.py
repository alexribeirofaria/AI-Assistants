from application.enums.user_action import UserAction
from application.helpers.abstracts.base_helper import BaseHelper
from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy
from application.decorator.strategies.decorator.decorator_helper_strategy import strategy

@strategy(priority=5)
class HelpStrategy(BaseHelperStrategy):
    _PHRASES = ["help", "ajuda", "comandos"]

    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        return BaseHelper.best_match(normalized, self._PHRASES, 0.75) is not None

    def handle(self, normalized: str, tokens: list[str]):
        return UserAction.MESSAGE, "help"