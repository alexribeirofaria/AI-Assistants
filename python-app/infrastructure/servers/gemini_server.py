from infrastructure.servers.factories.gemini_server_factory import GeminiServerFactory
from infrastructure.servers.abstracts.base_server import BaseServer

class GeminiServer(BaseServer):
    def create_factory(self) -> GeminiServerFactory:
        return GeminiServerFactory()
