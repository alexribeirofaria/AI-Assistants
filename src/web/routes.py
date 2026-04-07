from flask import jsonify, request
from application.ai_assistant_app import AIAssistantApp


class AppRoutes(AIAssistantApp):
    def __init__(self, app):
        super().__init__()
        self.app = app
        self.ai_assistant_app = AIAssistantApp()

    def register_routes(self):

        @self.app.route("/health")
        def health():
            return {"status": "ok"}

        @self.app.route("/assistant", methods=["GET"])
        def assistant():
            message = request.args.get("message")

            try:
                response = self.ai_assistant_app.run_web_app(message)

                return jsonify({"input": message, "response": response})
            except Exception as e:
                return jsonify({"error": str(e)}), 500
