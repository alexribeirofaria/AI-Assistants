from argparse import ArgumentParser
from app.console_app import ConsoleApp
from app.web_app import WebApp


def main():
    parser = ArgumentParser()
    parser.add_argument("--app", choices=["console", "web"], default="console")
    args = parser.parse_args()

    app = ConsoleApp() if args.app == "console" else WebApp()
    app.run()


if __name__ == "__main__":
    main()
