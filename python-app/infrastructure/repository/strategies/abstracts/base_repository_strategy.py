from abc import ABC, abstractmethod

class BaseRepositoryStrategy(ABC):

    @abstractmethod
    def build_domain(self):
        pass