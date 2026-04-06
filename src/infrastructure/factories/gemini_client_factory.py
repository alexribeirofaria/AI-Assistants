from infrastructure.factories.abstracts.base_client_factory import BaseClientFactory

class GeminiClientFactory(BaseClientFactory):
    def _build_client(self):
        from google import genai

        api_key = self.get_required_env("LLM__GEMINI_API_KEY", "Gemini API key não encontrada no .env")
        return genai.Client(api_key=api_key)
