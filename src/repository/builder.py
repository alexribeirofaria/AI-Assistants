from typing import Any
from domain.abstracts.base_domain import BaseDomain
from infrastructure.clients.abstracts.base_client import BaseClient
from repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class Builder(BaseRepositoryStrategy):
    def __init__(self, client: BaseClient, domain_cls: BaseDomain):
        self._client = client
        self._domain_cls = domain_cls

    def build_domain(self) -> Any:
        return self._domain_cls(self._client, self._domain_cls.__name__)