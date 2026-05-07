from abc import ABC
from domain.abstracts.base_domain import BaseDomain
from infrastructure.repository.repository import Repository

class BaseApplicationStrategy(ABC):
    def __init__(self, domain):
        self.repo = Repository()
        self.domain_class = domain

    def ensure_domain(self) -> BaseDomain:
        return self.repo.build_domain(self.domain_class)

    def list_domains(self):
        models = self.ensure_domain().list_models()
        header = f"=== {self.domain_class.get_domain_name()} Models ==="
        return header, models, ""

    def execute(self, prompt: str) -> str:
        return self.ensure_domain().send_message(prompt)


