from infrastructure.factories.abstracts.base_client_factory import BaseClientFactory

class LangChainClientFactory(BaseClientFactory):
    def _build_client(self, model: str = "gpt-4o-mini"):
        from langchain_openai import ChatOpenAI
        api_key = self.get_required_env("LLM__LangChain_API_KEY", "LangChain API key não encontrada no .env")
        timeout = self.get_optional_float_env("LLM__LangChain_TIMEOUT_SECONDS", 30.0)
        max_retries = self.get_optional_int_env("LLM__LangChain_MAX_RETRIES", 1)
        return ChatOpenAI(api_key=api_key, timeout=timeout, max_retries=max_retries, model=model)

