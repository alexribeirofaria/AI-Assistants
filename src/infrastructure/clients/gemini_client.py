from infrastructure.factories.gemini_client_factory import GeminiClientFactory
from infrastructure.clients.abstracts.base_client import BaseClient

class GeminiClient(BaseClient):
    def create_factory(self) -> GeminiClientFactory:
        return GeminiClientFactory()
