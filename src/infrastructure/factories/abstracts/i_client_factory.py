from abc import ABC, abstractmethod
from typing import Any

class IClientFactory(ABC):
    @abstractmethod
    def create_client(self) -> Any:
        pass
