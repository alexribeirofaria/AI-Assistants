from domain.abstracts.base_domain import BaseDomain
from infrastructure.servers.abstracts.base_server import BaseServer
from infrastructure.repository.strategies.abstracts.base_repository_strategy import BaseRepositoryStrategy

class RepositoryStrategy(BaseRepositoryStrategy):

    def __init__(self, server: BaseServer, domain_cls: BaseDomain):
        self._server = server
        self._domain_cls = domain_cls

    def build_domain(self) -> BaseDomain:
        return self._domain_cls

    @property
    def server(self) -> BaseServer:
        return self._server