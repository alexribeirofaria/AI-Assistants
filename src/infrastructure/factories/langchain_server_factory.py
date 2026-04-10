from langchain_openai import ChatOpenAI
from pydantic import SecretStr
from infrastructure.factories.abstracts.base_server_factory import BaseServerFactory

class LangChainServerFactory(BaseServerFactory):

    def _build_server(self, model: str = "llama3-70b-8192") -> ChatOpenAI:

        api_key: SecretStr = SecretStr(secret_value=self.get_required_env(
            key="LLM__GROQ_API_KEY",
            error_message="LangChain API key não encontrada no .env"))

        timeout: float = self.get_optional_float_env(
            key="LLM__TIMEOUT_SECONDS", default=30.0
        )

        max_retries: int = self.get_optional_int_env(key="LLM__MAX_RETRIES", default=1)

        return ChatOpenAI(
            api_key=api_key, model=model, timeout=timeout, max_retries=max_retries
        )
