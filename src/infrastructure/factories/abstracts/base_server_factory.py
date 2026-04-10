import os
from abc import abstractmethod
from typing import Any
from dotenv import load_dotenv

class BaseServerFactory:
    def create_client(self) -> Any:        
        load_dotenv()
        return self._build_server()

    def get_required_env(self, key: str, error_message: str) -> str:
        value: str = os.environ.get(key)
        if not value:
            raise ValueError(error_message)
        return value

    def get_optional_env(self, key: str, default: str) -> str:
        return os.environ.get(key, default)

    def get_optional_int_env(self, key: str, default: int) -> int:
        raw_value: str = os.environ.get(key)
        if not raw_value:
            return default

        try:
            return int(raw_value)
        except ValueError as exc:
            raise ValueError(f"Valor inválido para {key}: esperado inteiro") from exc

    def get_optional_float_env(self, key: str, default: float) -> float:
        raw_value: str = os.environ.get(key)
        if not raw_value:
            return default

        try:
            return float(raw_value)
        except ValueError as exc:
            raise ValueError(f"Valor inválido para {key}: esperado número") from exc

    @abstractmethod
    def _build_server(self):
        pass
