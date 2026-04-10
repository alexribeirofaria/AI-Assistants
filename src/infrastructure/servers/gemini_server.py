from infrastructure.servers.factories.gemini_server_factory import GeminiServerFactory
from infrastructure.servers.abstracts.base_server import IServer

class GeminiServer(IServer):
    def create_factory(self) -> GeminiServerFactory:
        return GeminiServerFactory()
