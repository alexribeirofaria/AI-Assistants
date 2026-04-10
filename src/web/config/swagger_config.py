from flasgger import Swagger

class SwaggerConfig:

    @staticmethod
    def configure(app) -> None:
        Swagger(
            app,
            config={
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
                "specs_route": "/",
            },
            template={
                "swagger": "2.0",
                "info": {
                    "title": "Minha API Flask",
                    "description": "Documentação automática",
                    "version": "1.0.0",
                },
            },
        )
