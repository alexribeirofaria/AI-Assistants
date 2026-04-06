from openai import OpenAIError, RateLimitError, APIError
from domain.abstracts.base_domain import BaseDomain
from domain.cache.domain_list_cache import CachedDomainListMixin

class Groq(BaseDomain, CachedDomainListMixin):
    _DEFAULT_MODEL_NAME = "llama-3.1-8b-instant"

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
            return response.choices[0].message.content or ""
        except RateLimitError as e:
            return f"[QUOTA ERROR] {e}"
        except APIError as e:
            return f"[API ERROR] {e}"
        except OpenAIError as e:
            return f"[GENERAL ERROR] {e}"
        except Exception as e:
            return f"[UNKNOWN ERROR] {e}"

    def list_models(self):
        try:
            return self._get_domain_view("=== Groq Models ===")
        except Exception as e:
            return "=== Groq Models ===", [f"[ERROR] {e}"], ""

    def _fetch_domain_names(self) -> list[str]:
        models = self.client.models.list()
        return [m.id for m in models.data]
