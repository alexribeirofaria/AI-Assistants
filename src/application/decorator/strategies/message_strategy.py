from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy
from application.decorator.strategies.decorator.decorator_helper_strategy import strategy
from application.enums.user_action import UserAction

@strategy(priority=999)  # sempre último
class MessageStrategy(BaseHelperStrategy):

    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        return True

    def handle(self, normalized: str, tokens: list[str]):
        return UserAction.MESSAGE, " ".join(tokens)