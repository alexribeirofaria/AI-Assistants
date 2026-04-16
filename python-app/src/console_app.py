from application.ai_assistant_app import AIAssistantApp

class ConsoleApp:

    def __init__(self):
        self.app = AIAssistantApp()

    def run(self):
        self.app.run_console_app()