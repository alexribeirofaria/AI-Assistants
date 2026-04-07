from application.enums.user_action import UserAction
from application.helpers.abstracts.base_helper import BaseHelper
from presentation.presenters.i_output_presenter import IOutputPresenter

class Helper(BaseHelper):
    
    def interpret_user_input(self, user_input: str):
        action, value = self._interpret_normalized_internal(user_input)
        return action, value    
    
    def interpret_user_input_with_feedback(
        self,
        user_input: str,
        presenter: IOutputPresenter):
        action, value = self._interpret_normalized_internal(user_input)

        normalized = self.normalize_text(user_input).replace(" ", "")
        
        expected_map = {
            UserAction.LIST_MODELS: "list models",
            UserAction.EXIT: "exit",
            UserAction.CLEAR: "cls",
        }

        expected = expected_map.get(action)

        if expected and normalized != expected.replace(" ", ""):
            presenter.show_interpreted_input(user_input, expected)

        return action, value
        
    def _interpret_normalized_internal(self, raw: str):
        normalized = self.normalize_text(raw)

        if not normalized:
            return UserAction.MESSAGE, None

        tokens = normalized.split()
        candidate = normalized.replace(" ", "")

        # 🔹 LIST MODELS
        list_models_phrases = [
            "list models",
            "list model",
            "listmodels",
            "listmodel",
            "models",
            "modelos",
            "listar modelos",
        ]

        list_models_phrases_norm = [
            self.normalize_text(p).replace(" ", "") for p in list_models_phrases
        ]

        match = self.best_match(candidate, list_models_phrases_norm, cutoff=0.70)
        if match:
            return UserAction.LIST_MODELS, None

        # 🔹 EXIT
        exit_phrases = [
            "exit",
            "quit",
            "sair",
        ]

        exit_phrases_norm = [
            self.normalize_text(p).replace(" ", "") for p in exit_phrases
        ]

        match = self.best_match(candidate, exit_phrases_norm, cutoff=0.75)
        if match:
            return UserAction.EXIT, None

        # 🔹 CLEAR
        clear_phrases = [
            "cls",
            "clear"
        ]

        clear_phrases_norm = [
            self.normalize_text(p).replace(" ", "") for p in clear_phrases
        ]

        match = self.best_match(candidate, clear_phrases_norm, cutoff=0.75)
        if match:
            return UserAction.CLEAR, None

        # 🔹 SWITCH MODEL (mantém por token único)
        if len(tokens) == 1:
            word = tokens[0]

            provider = self.best_match(
                word, ["claude", "openai", "gemini", "groq"], cutoff=0.75
            )
            if provider:
                return UserAction.SWITCH_MODEL, provider

        # 🔹 fallback
        return UserAction.MESSAGE, raw