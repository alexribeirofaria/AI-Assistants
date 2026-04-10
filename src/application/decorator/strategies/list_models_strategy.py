from collections.abc import Sequence
from application.enums.user_action import UserAction
from application.decorator.helpers.decorator_text_helper import DecoratorTextHelper
from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy
from application.decorator.strategies.decorator.decorator_helper_strategy import strategy

@strategy(priority=10)
class ListModelsStrategy(BaseHelperStrategy):
    _PHRASES = [
        "list models",
        "list model",
        "listmodels",
        "listmodel",
        "models",
        "modelos",
        "listar modelos",
    ]

    def can_handle(self, normalized: str, tokens: Sequence[str]) -> bool:
        candidate = normalized.replace(" ", "")
        phrases = [DecoratorTextHelper.normalize_text(p).replace(" ", "") for p in self._PHRASES]
        return DecoratorTextHelper.best_match(candidate, phrases, 0.70) is not None

    def handle(self, normalized: str, tokens: Sequence[str]):
        return UserAction.LIST_MODELS, None
