from abc import ABC
import os
from flask import send_from_directory

class StaticController(ABC):
    def __init__(self, app) -> None:
        self._app = app

    @staticmethod
    def hello(self):
        return {"message": "Hello from Flask"}

    @staticmethod
    def spa(self, path: str):
        if path.startswith("apispec") or path.startswith("flasgger_static"):
            return self._app.send_static_file(path)

        if path.startswith("api"):
            return {"error": "Not Found"}, 404

        file_path = os.path.join(self._app.static_folder, path)
        if os.path.exists(file_path):
            return send_from_directory(self._app.static_folder, path)

        return send_from_directory(self._app.static_folder, "index.html")
