from infrastructure.factories.anthropic_client_factory import AnthropicClientFactory
from infrastructure.clients.abstracts.base_client import BaseClient

class ClaudeClient(BaseClient):
    def create_factory(self) -> AnthropicClientFactory:
        return AnthropicClientFactory()
