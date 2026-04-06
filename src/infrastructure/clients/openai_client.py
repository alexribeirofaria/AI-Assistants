from infrastructure.factories.openai_client_factory import OpenAIClientFactory
from infrastructure.clients.abstracts.base_client import BaseClient

class OpenAIClient(BaseClient):
    def create_factory(self) -> OpenAIClientFactory:
        return OpenAIClientFactory()
