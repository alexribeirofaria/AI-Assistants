from domain.abstracts.base_domain import BaseDomain

class Gemini(BaseDomain):
    
    def __init__(self, server, model_name):        
        super().__init__(server=server, model_name=model_name)
        self.model = "gemini-2.5-flash"
        self.max_tokens = 4096

    def build_response_messages(self, response):
        return getattr(response, "text", "")

    def send_message(self, prompt: str) -> str:
        def gemini_call():
            chat = self.server.chats.create(model=self.model)
            return chat.send_message(
                prompt,
                config={"max_output_tokens": self.max_tokens}
            )
        return self.send(lambda: gemini_call())

    def list_models(self):
        try:
            return self._get_domain_view()
        except Exception as e:
            return [f"[ERROR] {e}"]

    def _fetch_domain_names(self) -> list[str]:
        return [m.name for m in self.server.models.list()]


