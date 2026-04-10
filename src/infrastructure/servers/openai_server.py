from infrastructure.servers.factories.openai_server_factory import OpenAIServerFactory
from infrastructure.servers.abstracts.base_server import IServer

class OpenAIServer(IServer):
    def create_factory(self) -> OpenAIServerFactory:
        return OpenAIServerFactory()
