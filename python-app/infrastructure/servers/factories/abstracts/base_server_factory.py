import os
from abc import abstractmethod
from dotenv import load_dotenv
from infrastructure.servers.abstracts.base_server import BaseServer
from infrastructure.servers.factories.abstracts.i_server_factory import IServerFactory


class BaseServerFactory(IServerFactory):

    def __init__(self):
        load_dotenv()
    
    @abstractmethod
    def build_server(self, server_cls : BaseServer):
        pass
    
    def create_server(self):
        return self.build_server(server_cls=self)
    
    def _get_env(self, key: str) -> str:
        value = os.environ.get(key)
        if not value:
            raise RuntimeError(f"Missing required environment variable: {key}")
        return value

    def _get_env_or(self, key: str, default: str) -> str:
        value = os.environ.get(key)
        return value if value else default

    def _get_env_int(self, key: str, default: int) -> int:
        value = os.environ.get(key)
        if not value:
            return default
        try:
            return int(value)
        except ValueError as exc:
            raise ValueError(f"Invalid int for env '{key}': {value}") from exc

    def _get_env_float(self, key: str, default: float) -> float:
        value = os.environ.get(key)
        if not value:
            return default
        try:
            return float(value)
        except ValueError as exc:
            raise ValueError(f"Invalid float for env '{key}': {value}") from exc

    def require_env(self, key: str, error_message: str) -> str:
        value = self._get_env(key)
        if not value:
            raise ValueError(error_message)
        return value

    def optional_env(self, key: str, default: str) -> str:
        return self._get_env_or(key, default)

    def optional_int_env(self, key: str, default: int) -> int:
        return self._get_env_int(key, default)

    def optional_float_env(self, key: str, default: float) -> float:
        return self._get_env_float(key, default)