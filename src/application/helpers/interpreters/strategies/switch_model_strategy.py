from application.enums.user_action import UserAction
from application.helpers.interpreters.strategies.interpreter_strategy_registry import InterpreterStrategyRegistry
from .base_interpreter_strategy import BaseInterpreterStrategy

class SwitchModelStrategy(BaseInterpreterStrategy):
    _PROVIDERS = ["claude", "openai", "gemini", "groq"]
    
    def __init__(self):
      InterpreterStrategyRegistry.register(SwitchModelStrategy)

    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        return len(tokens) == 1 and tokens[0] in self._PROVIDERS

    def handle(self, normalized: str, tokens: list[str]):
        return UserAction.SWITCH_MODEL, tokens[0]