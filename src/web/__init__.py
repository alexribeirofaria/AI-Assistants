from flask import Flask
from flasgger import Swagger

def create_app():
    app = Flask(
        __name__,
        static_folder="./static",
        static_url_path=""
    )

    from .routes import AppRoutes
    routes = AppRoutes(app)
    routes.register_routes()

    from .api import register_api
    register_api(app)

    Swagger(app, config={
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec",
                "route": "/apispec.json",
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "swagger_ui": True,
        "specs_route": "/"
    }, template={
        "swagger": "2.0",
        "info": {
            "title": "Minha API Flask",
            "description": "Documentação automática",
            "version": "1.0.0"
        }
    })

    return app