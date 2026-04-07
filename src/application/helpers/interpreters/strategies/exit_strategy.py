from application.enums.user_action import UserAction
from application.helpers.interpreters.strategies.interpreter_strategy_registry import InterpreterStrategyRegistry
from .base_interpreter_strategy import BaseInterpreterStrategy

class ExitStrategy(BaseInterpreterStrategy):
    PHRASES = ["exit", "quit", "sair"]

    def __init__(self):
        InterpreterStrategyRegistry.register(ExitStrategy)

    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        return normalized in self.PHRASES

    def handle(self, normalized: str, tokens: list[str]):
        return UserAction.EXIT, None