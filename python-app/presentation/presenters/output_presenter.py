from presentation.interfaces.i_output_formatter import IOutputFormatter
from presentation.interfaces.i_output_stream import IOutputStream
from presentation.presenters.i_output_presenter import IOutputPresenter

class OutputPresenter(IOutputPresenter):
    def __init__(self, formatter: IOutputFormatter, stream: IOutputStream):
        self.formatter = formatter
        self.stream = stream

    def show_ui(self) -> None:
        self.stream.write(self.formatter.format_welcome())
        self.stream.write(self.formatter.format_help())

    def show_model_switched(self, prompt: str) -> None:
        self.stream.write(self.formatter.format_model_switched(prompt))
        self.stream.write(self.formatter.format_help())

    def show_interpreted_input(self, raw: str, interpreted: str) -> None:
        self.stream.write(self.formatter.format_interpreted_input(raw, interpreted))

    def show_response(self, domain_name: str, response: str) -> None:
        self.stream.write(self.formatter.format_response(domain_name, response))

    def show_loading_models(self) -> None:
        self.stream.write(self.formatter.format_loading_models())

    def show_elapsed_time(self, minutes: int, seconds: int) -> None:
        self.stream.write_inline(self.formatter.format_elapsed_time(minutes, seconds))

    def clear_elapsed_time(self) -> None:
        self.stream.clear_inline()

    def show_model_list(self, header: str, names: list[str], prefix: str = "- ") -> None:
        self.stream.write(self.formatter.format_model_list(header, names, prefix))
        self.stream.write("")

    def show_warning(self, message: str) -> None:
        self.stream.write(self.formatter.format_warning(message))

    def show_error(self, message: str) -> None:
        self.stream.write(self.formatter.format_error(message))

    def show_goodbye(self) -> None:
        self.stream.write(self.formatter.format_goodbye())
