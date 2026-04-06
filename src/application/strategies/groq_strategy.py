from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy

class GroqStrategy(BaseApplicationStrategy):
    def __init__(self):
        super().__init__("groq")

    def execute(self, prompt: str) -> str:
        return self.ensure_domain().send_message(prompt)
