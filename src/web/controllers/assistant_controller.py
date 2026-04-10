from flask import jsonify, request
from application.ai_assistant_app import AIAssistantApp
from web.controllers.static_controller import StaticController

class AssistantController(StaticController):
    def __init__(self, assistant_app: AIAssistantApp | None = None) -> None:
        self._assistant_app = assistant_app or AIAssistantApp()

    def health(self):
        return {"status": "ok"}

    def assistant(self):
        message = request.args.get("message")
        try:
            response = self._assistant_app.run_web_app(message)
            return jsonify({"input": message, "response": response})
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500
