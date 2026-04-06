from openai import OpenAI
from infrastructure.factories.abstracts.base_client_factory import BaseClientFactory

class OpenAIClientFactory(BaseClientFactory):
    def _build_client(self) -> OpenAI:
        api_key: str = self.get_required_env(key="LLM__OPEN_API_KEY", error_message="OpenAI API key não encontrada no .env")
        timeout: float = self.get_optional_float_env(key="LLM__OPENAI_TIMEOUT_SECONDS", default=30.0)
        max_retries: int = self.get_optional_int_env(key="LLM__OPENAI_MAX_RETRIES", default=1)
        return OpenAI(api_key=api_key, timeout=timeout, max_retries=max_retries)
