from flask import Flask
from web.route_registry import RouteRegistry
from web.config.swagger_config import SwaggerConfig

class AppFactory:

    @staticmethod
    def create_app() -> Flask:
        app = Flask(
            __name__,
            static_folder="static",
            static_url_path=""
        )

        RouteRegistry(app).register()
        SwaggerConfig.configure(app)

        return app