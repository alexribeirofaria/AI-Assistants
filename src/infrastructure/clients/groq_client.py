from infrastructure.factories.groq_client_factory import GroqClientFactory
from infrastructure.clients.abstracts.base_client import BaseClient

class GroqClient(BaseClient):
    def create_factory(self) -> GroqClientFactory:
        return GroqClientFactory()
