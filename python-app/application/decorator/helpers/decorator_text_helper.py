import difflib
import re
from collections.abc import Sequence


class DecoratorTextHelper:
    @staticmethod
    def normalize_text(text: str) -> str:
        cleaned = re.sub(r"[^a-z0-9]+", " ", (text or "").strip().lower())
        return " ".join(cleaned.split())

    @staticmethod
    def best_match(text: str, options: Sequence[str], cutoff: float) -> str | None:
        matches = difflib.get_close_matches(text, options, n=1, cutoff=cutoff)
        return matches[0] if matches else None
