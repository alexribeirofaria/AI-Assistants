from domain.abstracts.base_domain import BaseDomain
import re


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
                prompt, config={"max_output_tokens": self.max_tokens}
            )

        return self.send(lambda: gemini_call())

    def list_models(self):
        try:
            models = self._get_domain_view()
            return [
                self._normalize_model_name(m)
                for m in models
                if isinstance(m, str)
                and m.strip()
                and not m.strip().startswith("===")
                and self.is_text_model(m)
            ]

        except Exception as e:
            return [f"[ERROR] {e}"]

    def _fetch_domain_names(self) -> list[str]:
        return [m.name for m in self.server.models.list()]

    def is_text_model(self, name: str) -> bool:
        if not name:
            return False

        name = name.lower()

        return not re.search(
            r"(embedding|image|tts|audio|robotics|generate|clip)", name
        )

    def _normalize_model_name(self, name: str) -> str:
        if not name:
            return ""

        # remove conteúdo entre () e []
        name = re.sub(r"\(.*?\)|\[.*?\]", "", name)

        # remove palavras irrelevantes
        name = re.sub(
            r"\b(preview|latest|fast|lite|pro|tts|clip|custom tools)\b",
            "",
            name,
            flags=re.IGNORECASE,
        )

        # remove caracteres especiais (mantém letras, números, espaço, . e -)
        name = re.sub(r"[^a-zA-Z0-9\s\.-]", "", name)

        # trim + normaliza espaços para hífen
        name = re.sub(r"\s+", "-", name.strip())

        # lowercase
        return name.lower()
