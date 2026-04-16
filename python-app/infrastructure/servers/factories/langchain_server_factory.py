from langchain_openai import ChatOpenAI
from pydantic import SecretStr
from infrastructure.servers.factories.abstracts.base_server_factory import BaseServerFactory

class LangChainServerFactory(BaseServerFactory):

    def build_server(self) -> ChatOpenAI:
        self.model: str = "llama3-70b-8192"
        api_key: SecretStr = SecretStr(secret_value=self.require_env(
            key="LLM__GROQ_API_KEY",
            error_message="LangChain API key não encontrada no .env"))

        timeout: float = self.optional_float_env(
            key="LLM__TIMEOUT_SECONDS", default=30.0
        )

        max_retries: int = self.optional_int_env(key="LLM__MAX_RETRIES", default=1)

        return ChatOpenAI(
            api_key=api_key, model=self.model, timeout=timeout, max_retries=max_retries
        )
