from typing import Any, Tuple, Optional
from application.enums.user_action import UserAction
from application.helpers.abstracts.base_helper import BaseHelper
from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy
from presentation.presenters.i_output_presenter import IOutputPresenter

class DecoratorInterpreter:

    def __init__(self, strategies: list[BaseHelperStrategy]):
        self._strategies = strategies

        self._expected_map = {
            UserAction.LIST_MODELS: "list models",
            UserAction.EXIT: "exit",
            UserAction.CLEAR: "cls",
        }

    def interpret_user_input_with_feedback(
        self,
        user_input: str,
        presenter: IOutputPresenter
    ) -> Tuple[UserAction, Optional[str]]:

        normalized = BaseHelper.normalize_text(user_input)
        tokens = normalized.split()

        action, value = self._interpret(normalized, tokens)

        expected = self._expected_map.get(action)
        compact_input = normalized.replace(" ", "")

        if expected and compact_input != expected.replace(" ", ""):
            presenter.show_interpreted_input(user_input, expected)

        return action, value

    def _interpret(self,
        normalized: str,
        tokens: list[str]) -> Tuple[Any, Optional[Any]]:

        candidate = normalized.replace(" ", "")

        for strategy in self._strategies:
            if strategy.can_handle(candidate, tokens):
                return strategy.handle(candidate, tokens)

        return UserAction.MESSAGE, normalized