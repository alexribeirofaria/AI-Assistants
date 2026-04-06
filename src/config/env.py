import os
from functools import lru_cache
from pathlib import Path

@lru_cache(maxsize=1)
def load_env_once() -> bool:
    """
    Carrega variáveis do `.env` uma única vez por processo.

    Retorna True/False indicando se encontrou arquivo `.env`.
    """
    dotenv_path = Path(__file__).resolve().parents[1] / ".env"
    if not dotenv_path.exists():
        return False

    for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()

        if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
            value = value[1:-1]

        if key and key not in os.environ:
            os.environ[key] = value

    return True
