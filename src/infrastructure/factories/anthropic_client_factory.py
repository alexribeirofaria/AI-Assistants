from infrastructure.factories.abstracts.base_client_factory import BaseClientFactory

class AnthropicClientFactory(BaseClientFactory):
    def _build_client(self):
        from anthropic import Anthropic

        api_key = self.get_required_env("LLM_CLAUDE_API_KEY", "Claude API key não encontrada no .env")
        return Anthropic(api_key=api_key)
