import os
from flask import send_from_directory

def register_api(app):

    @app.route("/api/hello", methods=["GET"])
    def hello():
        return {"message": "Hello from Flask"}
      
    @app.route("/<path:path>")
    def spa(path):

        if path.startswith("apispec") or path.startswith("flasgger_static"):
            return app.send_static_file(path)

        if path.startswith("api"):
            return {"error": "Not Found"}, 404

        file_path = os.path.join(app.static_folder, path)

        if os.path.exists(file_path):
            return send_from_directory(app.static_folder, path)

        return send_from_directory(app.static_folder, "index.html")      