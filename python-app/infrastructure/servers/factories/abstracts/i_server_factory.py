from abc import ABC, abstractmethod
from infrastructure.servers.abstracts.base_server import BaseServer


class IServerFactory(ABC):

    @abstractmethod
    def build_server(self, server_cls: BaseServer):
        pass
    
    @abstractmethod
    def require_env(self, key: str, error_message: str) -> str:
        pass

    @abstractmethod
    def optional_env(self, key: str, default: str) -> str:
        pass

    @abstractmethod
    def optional_int_env(self, key: str, default: int) -> int:
        pass

    @abstractmethod
    def optional_float_env(self, key: str, default: float) -> float:
        pass