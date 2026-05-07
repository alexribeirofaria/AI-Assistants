from infrastructure.servers.factories.anthropic_server_factory import AnthropicServerFactory
from infrastructure.servers.abstracts.base_server import BaseServer

class ClaudeServer(BaseServer):
    def create_factory(self) -> AnthropicServerFactory:
        return AnthropicServerFactory()
