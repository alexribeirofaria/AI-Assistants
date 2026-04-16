from openai import OpenAI
from infrastructure.servers.factories.abstracts.base_server_factory import BaseServerFactory

class GroqServerFactory(BaseServerFactory):
    def build_server(self) -> OpenAI:
        api_key: str = self.require_env(key="LLM__GROQ_API_KEY", error_message="Groq API key não encontrada no .env")
        base_url: str = self.optional_env(key="LLM__GROQ_BASE_URL", default="https://api.groq.com/openai/v1")
        timeout: float = self.optional_float_env(key="LLM__GROQ_TIMEOUT_SECONDS", default=30.0)
        max_retries: int = self.optional_int_env(key="LLM__GROQ_MAX_RETRIES", default=1)
        return OpenAI(
            api_key=api_key,
            base_url=base_url,
            timeout=timeout,
            max_retries=max_retries,
        )
