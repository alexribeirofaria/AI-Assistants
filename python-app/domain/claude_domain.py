from domain.abstracts.base_domain import BaseDomain

class Claude(BaseDomain):

    def __init__(self, server, model_name):        
        super().__init__(server=server, model_name=model_name)
        self.model = "claude-haiku-4-5-20251001"

    def build_response_messages(self, response) -> str:
        return "\n".join([r.text for r in response.content])
        
    def send_message(self, prompt: str) -> str:
        return self.send(lambda: self.server.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=self.max_tokens,
            ))

    def list_models(self):
        try:
            return self._get_domain_view("=== Claude Models ===")
        except Exception as e:
            return "=== Claude Models ===", [f"[ERROR] {e}"], ""

    def _fetch_domain_names(self) -> list[str]:
        models = self.server.models.list()
        return [m.id for m in models.data]
