from abc import ABC
from typing import Type
from domain.abstracts.base_domain import BaseDomain
from infrastructure.repository.repository import Repository

class BaseApplicationStrategy(ABC):
    def __init__(self, domain: Type[BaseDomain]):
        self.repo = Repository()
        self.domain_class: Type[BaseDomain] = domain

    def ensure_domain(self) -> BaseDomain:
        return self.repo.build_domain(self.domain_class)

    def list_domains(self):
        return self.ensure_domain().list_models()

    def execute(self, prompt: str) -> str:
        return self.ensure_domain().send_message(prompt)

