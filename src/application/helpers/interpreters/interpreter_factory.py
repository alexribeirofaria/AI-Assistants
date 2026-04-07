from application.helpers.interpreters.interpreter import Interpreter
from application.helpers.interpreters.strategies.interpreter_strategy_registry import InterpreterStrategyRegistry

class InterpreterFactory:

    @staticmethod
    def create() -> Interpreter:
        strategies = InterpreterStrategyRegistry.get_all()

        # strategies may define _priority; sort defensively
        strategies.sort(key=lambda s: getattr(s, "_priority", 0))

        return Interpreter(strategies)
