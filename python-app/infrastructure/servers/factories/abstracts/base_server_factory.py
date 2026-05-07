import os
from abc import abstractmethod
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

from infrastructure.servers.abstracts.base_server import BaseServer
from infrastructure.servers.factories.abstracts.i_server_factory import IServerFactory


class BaseServerFactory(IServerFactory):
    _PYTHON_APP_DIRNAME = "python-app"
    _ENV_FILENAME = ".env"

    def __init__(self) -> None:
        self._load_environment_files()

    @abstractmethod
    def build_server(self, server_cls: BaseServer):
        pass

    def create_server(self):
        return self.build_server(server_cls=self)

    def _load_environment_files(self) -> None:
        python_app_dir = self._resolve_python_app_dir()
        root_dir = python_app_dir.parent

        root_env = root_dir / self._ENV_FILENAME
        local_env = python_app_dir / self._ENV_FILENAME

        # Precedence: local app .env > root .env > code defaults.
        load_dotenv(dotenv_path=root_env, override=False)
        load_dotenv(dotenv_path=local_env, override=True)

    def _resolve_python_app_dir(self) -> Path:
        base_path = Path(__file__).resolve()

        python_app_dir = next(
            (
                parent
                for parent in base_path.parents
                if parent.name == self._PYTHON_APP_DIRNAME
            ),
            None,
        )

        if python_app_dir is not None:
            return python_app_dir

        # Safe fallback for unexpected folder layouts.
        return base_path.parent

    def _read_env(self, key: str) -> Optional[str]:
        return os.environ.get(key)

    def _get_env(self, key: str) -> str:
        value = self._read_env(key)
        if not value:
            raise RuntimeError(f"Missing required environment variable: {key}")
        return value

    def _get_env_or(self, key: str, default: str) -> str:
        value = self._read_env(key)
        return value if value else default

    def _get_env_int(self, key: str, default: int) -> int:
        value = self._read_env(key)
        if not value:
            return default
        try:
            return int(value)
        except ValueError as exc:
            raise ValueError(f"Invalid int for env '{key}': {value}") from exc

    def _get_env_float(self, key: str, default: float) -> float:
        value = self._read_env(key)
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
