from infrastructure.factories.openai_server_factory import OpenAIServerFactory
from infrastructure.servers.abstracts.base_server import BaseServer

class OpenAIServer(BaseServer):
    def create_factory(self) -> OpenAIServerFactory:
        return OpenAIServerFactory()
