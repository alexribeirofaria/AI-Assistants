from abc import ABC, abstractmethod
from typing import Any

class IServer(ABC):
    @abstractmethod
    def create_factory(self) -> Any:
        pass
    
    def load_server(self) -> Any:
        pass