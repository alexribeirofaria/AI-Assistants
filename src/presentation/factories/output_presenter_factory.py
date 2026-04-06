from presentation.interfaces.i_output_presenter_factory import IOutputPresenterFactory
from presentation.formatters.output_formatter import OutputFormatter
from presentation.presenters.output_presenter import OutputPresenter
from presentation.presenters.i_output_presenter import IOutputPresenter
from presentation.streams.output_stream import OutputStream

class OutputPresenterFactory(IOutputPresenterFactory):
    def create_presenter(self) -> IOutputPresenter:
        formatter = OutputFormatter()
        stream = OutputStream()
        return OutputPresenter(formatter=formatter, stream=stream)
