from openai import OpenAIError, RateLimitError, APIError
from domain.abstracts.base_domain import BaseDomain
from domain.cache.domain_list_cache import CachedDomainListMixin

class OpenAI(BaseDomain, CachedDomainListMixin):
    _DEFAULT_MODEL_NAME = "gpt-3.5-turbo"

    def __init__(self, client , model_name: str = _DEFAULT_MODEL_NAME):
        CachedDomainListMixin.__init__(self)
        super().__init__(client, model_name)

    def send_message(self, prompt: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.name,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=self.DEFAULT_MAX_TOKENS,
            )
            return response.choices[0].message.content
        except RateLimitError as e:
            return f"[QUOTA ERROR] Você excedeu sua cota ou limite de requisições: {e}"
        except APIError as e:
            return f"[API ERROR] Erro na API: {e}"
        except OpenAIError as e:
            return f"[GENERAL ERROR] Erro na OpenAI: {e}"
        except Exception as e:
            return f"[UNKNOWN ERROR] Ocorreu um erro inesperado: {e}"

    def list_models(self):
        try:
            return self._get_domain_view("=== OpenAI Models ===")
        except OpenAIError as e:
            return "=== OpenAI Models ===", [f"[ERROR] {e}"], ""

    def _fetch_domain_names(self) -> list[str]:
        models = self.client.models.list()
        return [m.id for m in models.data]
