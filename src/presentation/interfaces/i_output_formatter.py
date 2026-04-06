from abc import ABC, abstractmethod

class IOutputFormatter(ABC):
    @abstractmethod
    def format_help(self) -> str:
        pass

    @abstractmethod
    def format_welcome(self) -> str:
        pass

    @abstractmethod
    def format_model_switched(self, prompt: str) -> str:
        pass

    @abstractmethod
    def format_interpreted_input(self, raw: str, interpreted: str) -> str:
        pass

    @abstractmethod
    def format_response(self, domain_name: str, response: str) -> str:
        pass

    @abstractmethod
    def format_loading_models(self) -> str:
        pass

    @abstractmethod
    def format_elapsed_time(self, minutes: int, seconds: int) -> str:
        pass

    @abstractmethod
    def format_model_list(self, header: str, names: list[str], prefix: str = "- ") -> str:
        pass

    @abstractmethod
    def format_warning(self, message: str) -> str:
        pass

    @abstractmethod
    def format_error(self, message: str) -> str:
        pass

    @abstractmethod
    def format_goodbye(self) -> str:
        pass
