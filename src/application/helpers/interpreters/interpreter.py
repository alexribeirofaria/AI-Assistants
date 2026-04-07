from typing import Tuple, Optional
from application.enums.user_action import UserAction
from application.helpers.interpreters.strategies.base_interpreter_strategy import BaseInterpreterStrategy

class Interpreter:

    def __init__(self, strategies: list[BaseInterpreterStrategy]):
        self._strategies = strategies

        self._expected_map = {
            UserAction.LIST_MODELS: "list models",
            UserAction.EXIT: "exit",
            UserAction.CLEAR: "cls",
        }

    def interpret_user_input_with_feedback(
        self,
        user_input: str,
        presenter
    ) -> Tuple[UserAction, Optional[str]]:

        normalized = self._normalize(user_input)
        tokens = normalized.split()

        action, value = self._interpret(normalized, tokens)

        expected = self._expected_map.get(action)
        compact_input = normalized.replace(" ", "")

        if expected and compact_input != expected.replace(" ", ""):
            presenter.show_interpreted_input(user_input, expected)

        return action, value

    def _interpret(
        self,
        normalized: str,
        tokens: list[str]
    ) -> Tuple[UserAction, Optional[str]]:

        for strategy in self._strategies:
            if strategy.can_handle(normalized.replace(" ", ""), tokens):
                return strategy.handle(normalized.replace(" ", ""), tokens)

        # fallback defensivo (não deveria acontecer)
        return UserAction.MESSAGE, normalized

    def _normalize(self, text: str) -> str:
        return text.strip().lower()