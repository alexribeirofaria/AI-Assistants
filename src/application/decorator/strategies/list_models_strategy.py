from application.enums.user_action import UserAction
from application.helpers.abstracts.base_helper import BaseHelper
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

    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        candidate = normalized.replace(" ", "")
        phrases = [BaseHelper.normalize_text(p).replace(" ", "") for p in self._PHRASES]
        return BaseHelper.best_match(candidate, phrases, 0.70) is not None

    def handle(self, normalized: str, tokens: list[str]):
        return UserAction.LIST_MODELS, None
