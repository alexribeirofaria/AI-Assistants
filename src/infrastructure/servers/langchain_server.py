from infrastructure.factories.langchain_server_factory import LangChainServerFactory
from infrastructure.servers.abstracts.base_server import BaseServer

class LangChainServer(BaseServer):
    def create_factory(self) -> LangChainServerFactory:
        return LangChainServerFactory()
