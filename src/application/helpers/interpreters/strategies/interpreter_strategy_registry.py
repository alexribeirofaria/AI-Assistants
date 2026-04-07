from typing import Type, List
from application.helpers.interpreters.strategies.base_interpreter_strategy import BaseInterpreterStrategy

class InterpreterStrategyRegistry:
    _strategies: List[Type[BaseInterpreterStrategy]] = []

    @classmethod
    def register(cls, strategy: Type[BaseInterpreterStrategy]):
        cls._strategies.append(strategy)

    @classmethod
    def get_all(cls) -> List[BaseInterpreterStrategy]:
        # instancia automaticamente
        return [strategy() for strategy in list(cls._strategies)]