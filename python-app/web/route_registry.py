import os
from flask import Flask, send_from_directory
from web.controllers.assistant_controller import AssistantController


class RouteRegistry:

    def __init__(
        self, app: Flask, controller: AssistantController | None = None
    ) -> None:
        self._app: Flask = app
        self._controller: AssistantController = controller or AssistantController()

    def register(self):

        self._app.add_url_rule(
            "/health", "health", self._controller.health, methods=["GET"]
        )

        self._app.add_url_rule(
            "/assistant", "assistant", self._controller.assistant, methods=["POST"]
        )

        self._app.add_url_rule(
            "/models", "list_models", self._controller.list_models, methods=["GET"]
        )

        self._app.add_url_rule(
            "/providers",
            "list_providers",
            self._controller.list_providers,
            methods=["GET"],
        )

        self._app.add_url_rule(
            "/current-provider",
            "get_current_provider",
            self._controller.get_current_provider,
            methods=["GET"],
        )
        
        self._app.add_url_rule(
            "/default-model",
            "get_default-mnodel",
            self._controller.get_default_model,
            methods=["GET"],
        )

        self._app.add_url_rule(
            "/change-provider",
            "change_provider",
            self._controller.change_provider,
            methods=["POST"],
        )

        self._app.add_url_rule("/api/hello", "hello", self._hello, methods=["GET"])

        self._app.add_url_rule("/<path:path>", "spa", self._spa, methods=["GET"])

    def _hello(self):
        return {"message": "Hello from Flask"}

    def _spa(self, path: str):
        if path.startswith(("apispec", "flasgger_static")):
            return self._app.send_static_file(path)

        if path.startswith("api"):
            return {"error": "Not Found"}, 404

        static_folder = self._app.static_folder or "static"
        file_path = os.path.join(static_folder, path)

        if os.path.exists(file_path):
            return send_from_directory(static_folder, path)

        return send_from_directory(static_folder, "index.html")
