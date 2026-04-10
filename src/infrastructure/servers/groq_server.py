from infrastructure.servers.factories.groq_server_factory import GroqServerFactory
from infrastructure.servers.abstracts.base_server import IServer

class GroqServer(IServer):
    def create_factory(self) -> GroqServerFactory:
        return GroqServerFactory()
