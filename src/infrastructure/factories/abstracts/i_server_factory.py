from abc import ABC, abstractmethod
from typing import Any

class IServerFactory(ABC):
    @abstractmethod
    def create_server(self) -> Any:
        pass
