from argparse import ArgumentParser
from src.console_app import ConsoleApp
from src.web_app import WebApp


def main():
    parser = ArgumentParser()
    parser.add_argument("--app", choices=["console", "web"], default="console")
    args = parser.parse_args()

    app = ConsoleApp() if args.app == "console" else WebApp()
    app.run()


if __name__ == "__main__":
    main()
