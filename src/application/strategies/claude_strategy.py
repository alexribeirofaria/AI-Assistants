from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy

class ClaudeStrategy(BaseApplicationStrategy):

    def __init__(self):
        super().__init__("claude")

    def execute(self, prompt: str) -> str:
        return self.ensure_domain().send_message(prompt)
