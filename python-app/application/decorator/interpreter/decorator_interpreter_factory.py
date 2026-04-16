from application.decorator.interpreter.decorator_interpreter import DecoratorInterpreter
from application.decorator.strategies.decorator.decorator_helper_strategy import DecoratorHelperStrategy

class DecoratorInterpreterFactory:

    @staticmethod
    def create() -> DecoratorInterpreter :
        strategies = DecoratorHelperStrategy.create_instances()
        return DecoratorInterpreter(strategies)
