import difflib
import re
from abc import ABC

class BaseHelper(ABC):
    
    @staticmethod
    def normalize_text(text: str) -> str:
        cleaned = re.sub(r"[^a-z0-9]+", " ", (text or "").strip().lower())
        return " ".join(cleaned.split())

    @staticmethod
    def best_match(text: str, options: list[str], cutoff: float) -> str | None:
        matches = difflib.get_close_matches(text, options, n=1, cutoff=cutoff)
        return matches[0] if matches else None

    @staticmethod
    def capitalize_first_letter(value: str) -> str:
        if not value:
            return ""
        return value[0].upper() + value[1:]