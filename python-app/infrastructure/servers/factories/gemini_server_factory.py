from google.genai import Client
from infrastructure.servers.factories.abstracts.base_server_factory import BaseServerFactory

class GeminiServerFactory(BaseServerFactory):
    def build_server(self) -> Client:
        api_key: str = self.require_env(key="LLM__GEMINI_API_KEY", error_message="Gemini API key não encontrada no .env")
        return Client(api_key=api_key)
