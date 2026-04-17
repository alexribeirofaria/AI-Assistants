from flask import Flask
from flask_cors import CORS
from web.route_registry import RouteRegistry
from web.config.swagger_config import SwaggerConfig

class AppFactory:

    @staticmethod
    def create_app() -> Flask:
        app = Flask(__name__, static_folder="static", static_url_path="")
        CORS(app=app, resources={r"/*": {"origins": "*"}})
        RouteRegistry(app).register()
        SwaggerConfig.configure(app)
        return app