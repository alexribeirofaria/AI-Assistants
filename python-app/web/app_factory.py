from flask import Flask
from flask_cors import CORS
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

        # Habilitar CORS para permitir requisições do frontend Angular
        CORS(app, resources={
            r"/api/*": {
                "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"]
            },
            r"/models": {
                "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
                "methods": ["GET", "OPTIONS"],
                "allow_headers": ["Content-Type"]
            },
            r"/assistant": {
                "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
                "methods": ["GET", "POST", "OPTIONS"],
                "allow_headers": ["Content-Type"]
            },
            r"/change-provider": {
                "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
                "methods": ["GET", "POST", "OPTIONS"],
                "allow_headers": ["Content-Type"]
            },
            r"/health": {
                "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
                "methods": ["GET", "OPTIONS"]
            }
        })

        RouteRegistry(app).register()
        SwaggerConfig.configure(app)

        return app
