from abc import abstractmethod
from typing import Any
from infrastructure.servers.abstracts.i_server import IServer

class BaseServer(IServer):
    def __init__(self):
        _factory = self.create_factory()
        self._server = _factory.create_server()

    @abstractmethod
    def create_factory(self) -> Any:
        pass
    
    def load_server(self)-> Any:
        return self._server    
    