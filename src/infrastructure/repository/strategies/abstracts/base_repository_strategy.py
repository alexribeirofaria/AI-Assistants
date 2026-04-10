from abc import ABC, abstractmethod
from domain.abstracts.base_domain import BaseDomain

class BaseRepositoryStrategy(ABC):
    
    @abstractmethod
    def build_domain(self) -> BaseDomain:
        pass