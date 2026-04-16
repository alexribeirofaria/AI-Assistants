from abc import ABC, abstractmethod
from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy
from domain.abstracts.base_domain import BaseDomain

class IApplicationFactory(ABC):
    @abstractmethod
    def get_strategy(
        self, name: str | type[BaseDomain] | None
    ) -> BaseApplicationStrategy:
        pass
