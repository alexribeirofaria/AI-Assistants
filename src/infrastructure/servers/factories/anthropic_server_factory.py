from anthropic import Anthropic
from infrastructure.servers.factories.abstracts.i_server_factory import IServerFactory

class AnthropicServerFactory(IServerFactory):
    def build_server(self) -> Anthropic:
        api_key: str = self.require_env(key="LLM_CLAUDE_API_KEY", error_message="Claude API key não encontrada no .env")
        return Anthropic(api_key=api_key)
