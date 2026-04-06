import difflib
import re
from abc import ABC
from presentation.presenters.i_output_presenter import IOutputPresenter

class BaseHelper(ABC):
    
    @staticmethod
    def _normalize_text(text: str) -> str:
        cleaned = re.sub(r"[^a-z0-9]+", " ", (text or "").strip().lower())
        return " ".join(cleaned.split())

    @staticmethod
    def _best_match(text: str, options: list[str], cutoff: float) -> str | None:
        matches = difflib.get_close_matches(text, options, n=1, cutoff=cutoff)
        return matches[0] if matches else None

    def _interpret_user_input(self, raw: str, presenter: IOutputPresenter, default_model_agent):
        normalized = self._normalize_text(raw)
        if not normalized:
            return ("message", None)

        tokens = normalized.split()
        candidate = normalized.replace(" ", "")
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
            self._normalize_text(p).replace(" ", "") for p in list_models_phrases
        ]
        match = self._best_match(candidate, list_models_phrases_norm, cutoff=0.70)
        if match:
            if candidate != match:
                presenter.show_interpreted_input(raw, "list models")
            return ("list_models", None)

        # Comandos de 1 palavra: exit/cls e troca de modelo
        if len(tokens) == 1:
            word = tokens[0]
            cmd = self._best_match(word, ["exit", "cls"], cutoff=0.75)
            if cmd:
                if word != cmd:
                    presenter.show_interpreted_input(raw, cmd)
                return (cmd, None)

            provider = self._best_match(
                word, ["claude", "openai", "gemini", "groq"], cutoff=0.75
            )
            if provider:
                if word != provider:
                    presenter.show_interpreted_input(raw, provider)
                return ("switch_model", provider)

        # fallback: tratar como mensagem normal
        return ("message", None)
