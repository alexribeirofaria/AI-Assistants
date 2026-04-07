from openai import OpenAIError
from domain.abstracts.base_domain import BaseDomain

class OpenAI(BaseDomain):

    def __init__(self, client, model_name):        
        super().__init__(client=client, model_name=model_name)
        self.model = "gpt-3.5-turbo"

    def build_response_messages(self, response) -> str:
        return response.choices[0].message.content or ""

    def send_message(self, prompt: str) -> str:
        return self.send(lambda: self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=self.max_tokens,
            ))

    def list_models(self):
        try:
            return self._get_domain_view("=== OpenAI Models ===")
        except OpenAIError as e:
            return "=== OpenAI Models ===", [f"[ERROR] {e}"], ""

    def _fetch_domain_names(self) -> list[str]:
        models = self.client.models.list()
        return [m.id for m in models.data]
