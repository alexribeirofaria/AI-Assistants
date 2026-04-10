from infrastructure.servers.factories.anthropic_server_factory import AnthropicServerFactory
from infrastructure.servers.abstracts.base_server import IServer

class ClaudeServer(IServer):
    def create_factory(self) -> AnthropicServerFactory:
        return AnthropicServerFactory()
