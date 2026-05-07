from abc import ABC, abstractmethod

class IOutputStream(ABC):
    @abstractmethod
    def write(self, content: str) -> None:
        pass

    @abstractmethod
    def write_inline(self, content: str) -> None:
        pass

    @abstractmethod
    def clear_inline(self) -> None:
        pass
