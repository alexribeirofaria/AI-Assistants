from infrastructure.factories.abstracts.base_client_factory import BaseClientFactory

class GroqClientFactory(BaseClientFactory):
    def _build_client(self):
        from openai import OpenAI

        api_key = self.get_required_env("LLM__GROQ_API_KEY", "Groq API key não encontrada no .env")
        base_url = self.get_optional_env("LLM__GROQ_BASE_URL", "https://api.groq.com/openai/v1")
        timeout = self.get_optional_float_env("LLM__GROQ_TIMEOUT_SECONDS", 30.0)
        max_retries = self.get_optional_int_env("LLM__GROQ_MAX_RETRIES", 1)
        return OpenAI(
            api_key=api_key,
            base_url=base_url,
            timeout=timeout,
            max_retries=max_retries,
        )
