from importlib import import_module
from typing import Type, List
from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy

class DecoratorHelperStrategy:
    _strategies: List[Type[BaseHelperStrategy]] = []
    _loaded: bool = False

    @classmethod
    def register(cls, strategy: Type[BaseHelperStrategy]):
        cls._strategies.append(strategy)

    @classmethod
    def create_instances(cls) -> list[BaseHelperStrategy]:
        cls._ensure_loaded()
        return [s() for s in cls._strategies]

    @classmethod
    def _ensure_loaded(cls) -> None:
        if cls._loaded:
            return

        modules = (
            "application.decorator.strategies.exit_strategy",
            "application.decorator.strategies.clear_strategy",
            "application.decorator.strategies.list_models_strategy",
            "application.decorator.strategies.switch_model_strategy",
            "application.decorator.strategies.help_strategy",
            "application.decorator.strategies.message_strategy",
        )
        for module in modules:
            import_module(module)

        cls._loaded = True


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
