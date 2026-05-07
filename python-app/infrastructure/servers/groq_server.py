from infrastructure.servers.factories.groq_server_factory import GroqServerFactory
from infrastructure.servers.abstracts.base_server import BaseServer

class GroqServer(BaseServer):
    def create_factory(self) -> GroqServerFactory:
        return GroqServerFactory()
