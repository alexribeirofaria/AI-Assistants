from application.enums.user_action import UserAction
from application.helpers.interpreters.strategies.interpreter_strategy_registry import InterpreterStrategyRegistry
from .base_interpreter_strategy import BaseInterpreterStrategy

class MessageStrategy(BaseInterpreterStrategy):

    def __init__(self):
      InterpreterStrategyRegistry.register(MessageStrategy)

    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        return True 

    def handle(self, normalized: str, tokens: list[str]):
        return UserAction.MESSAGE, " ".join(tokens)