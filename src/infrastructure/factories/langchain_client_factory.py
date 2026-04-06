from langchain_openai import ChatOpenAI
from infrastructure.factories.abstracts.base_client_factory import BaseClientFactory

class LangChainClientFactory(BaseClientFactory):
    def _build_client(self, model: str = "gpt-4o-mini") -> ChatOpenAI:
        from pydantic import SecretStr
        api_key: SecretStr = SecretStr(secret_value=self.get_required_env(
            key="LLM__LangChain_API_KEY",
            error_message="LangChain API key não encontrada no .env"))
        timeout: float = self.get_optional_float_env(key="LLM__LangChain_TIMEOUT_SECONDS", default=30.0)
        max_retries: int = self.get_optional_int_env(key="LLM__LangChain_MAX_RETRIES", default=1)
        return ChatOpenAI(api_key=api_key, timeout=timeout, max_retries=max_retries, model=model)

