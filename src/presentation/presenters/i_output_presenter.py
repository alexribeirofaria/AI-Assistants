from abc import ABC, abstractmethod

class IOutputPresenter(ABC):
    @abstractmethod
    def show_ui(self) -> None:
        pass

    @abstractmethod
    def show_model_switched(self, prompt: str) -> None:
        pass

    @abstractmethod
    def show_interpreted_input(self, raw: str, interpreted: str) -> None:
        pass

    @abstractmethod
    def show_response(self, domain_name: str, response: str) -> None:
        pass

    @abstractmethod
    def show_loading_models(self) -> None:
        pass

    @abstractmethod
    def show_elapsed_time(self, minutes: int, seconds: int) -> None:
        pass

    @abstractmethod
    def clear_elapsed_time(self) -> None:
        pass

    @abstractmethod
    def show_model_list(self, header: str, names: list[str], prefix: str = "- ") -> None:
        pass

    @abstractmethod
    def show_warning(self, message: str) -> None:
        pass

    @abstractmethod
    def show_error(self, message: str) -> None:
        pass

    @abstractmethod
    def show_goodbye(self) -> None:
        pass
