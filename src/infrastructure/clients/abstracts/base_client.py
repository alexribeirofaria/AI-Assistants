from abc import ABC, abstractmethod
from infrastructure.factories.abstracts.i_client_factory import IClientFactory

class BaseClient(ABC):
    def __init__(self):
        _factory = self.create_factory()
        self._client = _factory.create_client()

    @abstractmethod
    def create_factory(self) -> IClientFactory:
        pass
    
    def load_client(self):
        return self._client