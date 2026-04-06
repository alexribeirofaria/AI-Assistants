from anthropic import Anthropic
from infrastructure.factories.abstracts.base_client_factory import BaseClientFactory

class AnthropicClientFactory(BaseClientFactory):
    def _build_client(self) -> Anthropic:
        api_key: str = self.get_required_env(key="LLM_CLAUDE_API_KEY", error_message="Claude API key não encontrada no .env")
        return Anthropic(api_key=api_key)
