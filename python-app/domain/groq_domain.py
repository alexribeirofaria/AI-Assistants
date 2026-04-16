from domain.abstracts.base_domain import BaseDomain

class Groq(BaseDomain):

    def __init__(self, server, model_name):        
        super().__init__(server=server, model_name=model_name)
        self.model = "llama-3.1-8b-instant"
    
    def build_response_messages(self, response) -> str:
        return response.choices[0].message.content

    def send_message(self, prompt: str) -> str:
        return self.send(lambda: self.server.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=self.max_tokens,
        ))

    def list_models(self):
        try:
            return self._get_domain_view("=== Groq Models ===")
        except Exception as e:
            return "=== Groq Models ===", [f"[ERROR] {e}"], ""

    def _fetch_domain_names(self) -> list[str]:
        models = self.server.models.list()
        return [m.id for m in models.data]
