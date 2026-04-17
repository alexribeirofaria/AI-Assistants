from flask import jsonify, request
from flasgger import swag_from  # type: ignore[import-untyped]
from application.ai_assistant_app import AIAssistantApp
from web.controllers.static_controller import StaticController

class AssistantController(StaticController):
    """Controller responsible for handling chat and model-related endpoints."""

    def __init__(self, assistant_app: AIAssistantApp | None = None) -> None:
        self._assistant_app = assistant_app or AIAssistantApp()

    @swag_from("../swagger/assistant_docs/health_get.yaml")
    def health(self):
        return {"status": "ok"}

    @swag_from("../swagger/assistant_docs/assistant_post.yaml")
    def assistant(self):
        data = request.get_json() or {}
        message = data.get("message")
        if not message:
            return jsonify({"error": "Missing 'message' in JSON body"}), 400
        try:
            response = self._assistant_app.run_web_app(message)
            return jsonify({"input": message, "response": response})
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500

    @swag_from("../swagger/assistant_docs/list_models_get.yaml")
    def list_models(self):
        try:
            query = request.args.get("q")
            prefix = request.args.get("prefix")
            provider = request.args.get("provider")

            if provider:
                self._assistant_app.set_provider(provider)

            models = self._assistant_app.list_models(search_query=query, prefix=prefix)
            current_provider = self._assistant_app.default_model_agent.get_domain_name()

            model_list = [
                {
                    "id": model_name.strip(),
                    "modelName": model_name.strip(),
                    "provider": current_provider,
                }
                for model_name in (models or [])
            ]

            return jsonify({"models": model_list})
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500

    def list_providers(self):
        try:
            available = self._assistant_app.get_available_providers()
            providers = [p.get_domain_name() for p in available]
            return jsonify({"providers": providers})
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500

    def get_current_provider(self):
        try:
            provider = self._assistant_app.default_model_agent.get_domain_name()
            return jsonify({"provider": provider})
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500

    @swag_from("../swagger/assistant_docs/change_provider_post.yaml")
    def change_provider(self):
        data = request.get_json() or {}
        provider = data.get("provider")
        if not provider:
            return jsonify({"error": "Missing 'provider' in JSON body"}), 400
        try:
            self._assistant_app.set_provider(provider)
            return jsonify({"status": "Provider updated to " + provider})
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500
