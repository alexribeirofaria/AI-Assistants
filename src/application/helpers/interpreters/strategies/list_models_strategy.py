from application.enums.user_action import UserAction
from application.helpers.interpreters.strategies.interpreter_strategy_registry import InterpreterStrategyRegistry
from .base_interpreter_strategy import BaseInterpreterStrategy

class ListModelsStrategy(BaseInterpreterStrategy):
    _PHRASES = [
        "listmodels", "listmodel", "models", "modelos", "listarmodelos"
    ]

    def __init__(self):
      InterpreterStrategyRegistry.register(ListModelsStrategy)
      

    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        return normalized in self._PHRASES

    def handle(self, normalized: str, tokens: list[str]):
        return UserAction.LIST_MODELS, None