from openai import OpenAI
from infrastructure.servers.factories.abstracts.base_server_factory import BaseServerFactory

class OpenAIServerFactory(BaseServerFactory):
    def build_server(self) -> OpenAI:
        api_key: str = self.require_env(key="LLM__OPEN_API_KEY", error_message="OpenAI API key não encontrada no .env")
        timeout: float = self.optional_float_env(key="LLM__OPENAI_TIMEOUT_SECONDS", default=30.0)
        max_retries: int = self.optional_int_env(key="LLM__OPENAI_MAX_RETRIES", default=1)
        return OpenAI(api_key=api_key, timeout=timeout, max_retries=max_retries)
