from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy
from application.decorator.strategies.decorator.decorator_helper_strategy import strategy
from application.enums.user_action import UserAction
from application.helpers.abstracts.base_helper import BaseHelper

@strategy(priority=15)
class SwitchModelStrategy(BaseHelperStrategy):
    _PROVIDERS = ["claude", "openai", "gemini", "groq"]
    
    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        if len(tokens) != 1:
            return False
        match = BaseHelper.best_match(tokens[0], self._PROVIDERS, 0.75)
        return match is not None

    def handle(self, normalized: str, tokens: list[str]):
        provider = BaseHelper.best_match(tokens[0], self._PROVIDERS, 0.75)
        return UserAction.SWITCH_MODEL, provider