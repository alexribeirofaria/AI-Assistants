from typing import Type, List
from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy

class DecoratorHelperStrategy:
    _strategies: List[Type[BaseHelperStrategy]] = []

    @classmethod
    def register(cls, strategy: Type[BaseHelperStrategy]):
        cls._strategies.append(strategy)

    @classmethod
    def create_instances(cls) -> list[BaseHelperStrategy]:
        return [s() for s in cls._strategies]


def strategy(priority: int = 0):
    """
    Decorator para registrar strategies automaticamente
    e definir prioridade (quanto menor, mais cedo executa)
    """

    def wrapper(cls: Type[BaseHelperStrategy]):
        cls._priority = priority
        DecoratorHelperStrategy.register(cls)
        return cls

    return wrapper
