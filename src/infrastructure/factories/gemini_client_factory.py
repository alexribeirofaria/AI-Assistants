from google.genai import Client
from infrastructure.factories.abstracts.base_client_factory import BaseClientFactory

class GeminiClientFactory(BaseClientFactory):
    def _build_client(self) -> Client:
        api_key: str = self.get_required_env(key="LLM__GEMINI_API_KEY", error_message="Gemini API key não encontrada no .env")
        return Client(api_key=api_key)
