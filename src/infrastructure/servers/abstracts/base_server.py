from abc import ABC, abstractmethod
from typing import Any

class BaseServer(ABC):
    def __init__(self):
        _factory = self.create_factory()
        self._server = _factory.create_server()

    @abstractmethod
    def create_factory(self) -> Any:
        pass
    
    def load_server(self):
        return self._server