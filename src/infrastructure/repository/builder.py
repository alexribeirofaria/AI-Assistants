from typing import Type
from domain.abstracts.base_domain import BaseDomain
from infrastructure.repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy
from infrastructure.servers.abstracts.base_server import BaseServer

class Builder(BaseRepositoryStrategy):

    def __init__(self, server: BaseServer, domain_cls: Type[BaseDomain]):
        self._servers = server
        self._domain_cls = domain_cls

    def build_domain(self) -> BaseDomain:
        return self._domain_cls(
            client=self._servers,
            model_name=self._domain_cls.get_domain_name()
        )