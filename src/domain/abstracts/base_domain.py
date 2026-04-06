from abc import ABC, abstractmethod

class BaseDomain(ABC):
    DEFAULT_MAX_TOKENS = 512

    def __init__(self, client, model_name: str) -> None:
        self.client = client
        self.name = model_name

    @abstractmethod
    def send_message(self, prompt: str) -> str:
        pass

    @abstractmethod
    def list_models(self) -> tuple[str, list[str], str]:
        pass
