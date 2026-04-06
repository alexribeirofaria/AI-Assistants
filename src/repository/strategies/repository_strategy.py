from domain.abstracts.base_domain import BaseDomain
from infrastructure.clients.abstracts.base_client import BaseClient
from repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class RepositoryStrategy(BaseRepositoryStrategy):
    def __init__(self, client: BaseClient):
        self._client = client

    def build_domain(self) -> BaseDomain:
        return self.build_domain(self.get_client())

    def get_client(self) -> BaseClient:
        return self._client
