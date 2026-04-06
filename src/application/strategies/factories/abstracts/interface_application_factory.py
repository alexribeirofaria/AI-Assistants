from abc import ABC, abstractmethod
from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy

class IApplicationFactory(ABC):
    @abstractmethod
    def get_strategy(self, name: str) -> BaseApplicationStrategy:
        pass
