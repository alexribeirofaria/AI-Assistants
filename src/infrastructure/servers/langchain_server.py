from infrastructure.servers.factories.langchain_server_factory import LangChainServerFactory
from infrastructure.servers.abstracts.base_server import IServer

class LangChainServer(IServer):
    def create_factory(self) -> LangChainServerFactory:
        return LangChainServerFactory()
