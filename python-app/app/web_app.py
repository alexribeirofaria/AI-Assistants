from flask import Flask
from web.app_factory import AppFactory

class WebApp:
    def __init__(self):
        self.app: Flask = AppFactory().create_app()

    def run(self):
        self.app.run(debug=True)
