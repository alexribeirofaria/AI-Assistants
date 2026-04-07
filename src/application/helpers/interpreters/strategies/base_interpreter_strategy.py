from abc import ABC, abstractmethod
from typing import Optional, Tuple
from application.enums.user_action import UserAction

class BaseInterpreterStrategy(ABC):

    @abstractmethod
    def can_handle(self, normalized: str, tokens: list[str]) -> bool:
        pass

    @abstractmethod
    def handle(self, normalized: str, tokens: list[str]) -> Tuple[UserAction, Optional[str]]:
        pass