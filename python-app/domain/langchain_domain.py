from langchain_core.messages import HumanMessage

from domain.abstracts.base_domain import BaseDomain


class LangChain(BaseDomain):
    @property
    def models(self) -> list[str]:
        return [
            # OpenAI
            "gpt-5.5",
            "gpt-5.4",
            "gpt-5.4-pro",
            "gpt-5.4-mini",
            "gpt-5.4-nano",
            "openai:gpt-5.3-codex",
            # Groq (via LangChain)
            "llama3-70b-8192",
            "mixtral-8x7b",
            # Gemini
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            # Claude
            "claude-3-haiku",
            "claude-3-sonnet",
        ]

    def __init__(self, server, model_name):
        super().__init__(server=server, model_name=model_name)
        self.model = "gpt-5.4-nano"

    def build_response_messages(self, response) -> str:
        return response.content

    def send_message(self, prompt: str) -> str:
        return self.send(lambda: self.server.invoke([HumanMessage(content=prompt)]))

    def list_models(self):
        try:
            return self._get_domain_view()
        except Exception as e:
            return [f"[ERROR] {e}"]

    def _fetch_domain_names(self) -> list[str]:
        return self.models
