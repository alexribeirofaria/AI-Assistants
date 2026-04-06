from abc import ABC, abstractmethod
from repository.repository import Repository

class BaseApplicationStrategy(ABC):
    def __init__(self, domain_type: str | None = None):
        self.repo = Repository()
        self.domain_type = domain_type.strip().lower() if domain_type else None
        self.domain = None

    def ensure_domain(self):
        if self.domain is None:
            if not self.domain_type:
                raise ValueError("domain_type não definido para esta strategy")
            self.domain = self.repo.get_domain(self.domain_type)
        return self.domain

    def list_domains(self):
        return self.ensure_domain().list_models()

    @abstractmethod
    def execute(self, prompt: str) -> str:
        pass
