from google.genai.errors import ClientError
from domain.abstracts.base_domain import BaseDomain
from domain.cache.domain_list_cache import CachedDomainListMixin

class Gemini(BaseDomain, CachedDomainListMixin):
    _DEFAULT_MODEL_NAME = "gemini-2.5-flash"

    def __init__(self, client , model_name: str = _DEFAULT_MODEL_NAME):
        CachedDomainListMixin.__init__(self)
        super().__init__(client, model_name)

    def _get_part_text(self, part):
        return getattr(part, "text", None)

    def send_message(self, prompt: str) -> str:
        try:
            chat = self.client.chats.create(model=self.name)

            response = chat.send_message(
                prompt,
                config={"max_output_tokens": self.DEFAULT_MAX_TOKENS},
            )

            # Caso simples
            if getattr(response, "text", None):
                return response.text

            # Fallback seguro
            parts = []
            candidates = getattr(response, "candidates", None) or []

            for candidate in candidates:
                content = getattr(candidate, "content", None)
                if not content:
                    continue

                for part in getattr(content, "parts", None) or []:
                    text = self._get_part_text(part)
                    if text:
                        parts.append(text)

            if parts:
                return "".join(parts)

            return "[EMPTY RESPONSE] O Gemini não retornou texto."

        except ClientError as e:
            return f"[CLIENT ERROR] Ocorreu um problema na API: {e}"
        except Exception as e:
            return f"[UNKNOWN ERROR] Erro inesperado: {e}"

    def list_models(self):
        try:
            return self._get_domain_view("=== Gemini Models ===", prefix="")
        except Exception as e:
            return "=== Gemini Models ===", [f"[ERROR] {e}"], ""

    def _fetch_domain_names(self) -> list[str]:
        return [m.name for m in self.client.models.list()]
