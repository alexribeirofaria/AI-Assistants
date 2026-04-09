from typing import Type
from domain.abstracts.base_domain import BaseDomain
from infrastructure.clients.abstracts.base_client import BaseClient
from repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class Builder(BaseRepositoryStrategy):

    def __init__(self, client: BaseClient, domain_cls: Type[BaseDomain]):
        self._client = client
        self._domain_cls = domain_cls

    def build_domain(self) -> BaseDomain:
        return self._domain_cls(
            client=self._client,
            model_name=self._domain_cls.get_domain_name()
        )