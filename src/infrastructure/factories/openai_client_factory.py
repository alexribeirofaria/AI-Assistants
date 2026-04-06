from infrastructure.factories.abstracts.base_client_factory import BaseClientFactory

class OpenAIClientFactory(BaseClientFactory):
    def _build_client(self):
        from openai import OpenAI
        api_key = self.get_required_env("LLM__OPEN_API_KEY", "OpenAI API key não encontrada no .env")
        timeout = self.get_optional_float_env("LLM__OPENAI_TIMEOUT_SECONDS", 30.0)
        max_retries = self.get_optional_int_env("LLM__OPENAI_MAX_RETRIES", 1)
        return OpenAI(api_key=api_key, timeout=timeout, max_retries=max_retries)
