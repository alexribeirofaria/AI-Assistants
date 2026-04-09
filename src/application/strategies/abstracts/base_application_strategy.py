from abc import ABC
from typing import Type
from domain.abstracts.base_domain import BaseDomain
from domain.abstracts.domain_type import DomainType
from repository.repository import Repository

class BaseApplicationStrategy(ABC):
    domain_type: DomainType

    def __init__(self, domain: Type[BaseDomain]):
        self.repo = Repository()
        self.domain: Type[BaseDomain] | None = domain or None

    def ensure_domain(self) -> BaseDomain:
        if self.domain is None and not self.domain_type:
            raise ValueError("Domain Type não definido para esta strategy")
        return self.repo.build_domain(self.domain)

    def list_domains(self):
        return self.ensure_domain().list_models()

    def execute(self, prompt: str) -> str:
        return self.ensure_domain().send_message(prompt)

