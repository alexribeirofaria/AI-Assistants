from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import Any
from application.enums.user_action import UserAction


class BaseHelperStrategy(ABC):
    _priority: int = 0

    @abstractmethod
    def can_handle(self, normalized: str, tokens: Sequence[str]) -> bool:
        pass

    @abstractmethod
    def handle(self, normalized: str, tokens: Sequence[str]) -> tuple[UserAction, Any | None]:
        pass
