from domain.abstracts.base_domain import BaseDomain
from domain.cache.domain_list_cache import CachedDomainListMixin

class Claude(BaseDomain, CachedDomainListMixin):
    _DEFAULT_MODEL_NAME = "claude-haiku-4-5-20251001"

    def __init__(self, client , model_name: str = None):
        CachedDomainListMixin.__init__(self)
        super().__init__(client, self._DEFAULT_MODEL_NAME or model_name)

    def send_message(self, prompt: str) -> str:
        try:
            message = self.client.messages.create(
                model=self.name,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=self.DEFAULT_MAX_TOKENS,
            )
            return "\n".join([r.text for r in message.content])

        except Exception as e:
            msg = str(e)
            if "quota" in msg.lower():
                return "[QUOTA ERROR] Limite de cota atingido"
            return f"[ERROR] {msg}"

    def list_models(self):
        try:
            return self._get_domain_view("=== Claude Models ===")
        except Exception as e:
            return "=== Claude Models ===", [f"[ERROR] {e}"], ""

    def _fetch_domain_names(self) -> list[str]:
        models = self.client.models.list()
        return [m.id for m in models.data]
