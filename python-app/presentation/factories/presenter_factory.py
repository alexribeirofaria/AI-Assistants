from presentation.factories.output_presenter_factory import OutputPresenterFactory
from presentation.presenters.i_output_presenter import IOutputPresenter

class PresenterFactory:
    @staticmethod
    def create_console_presenter() -> IOutputPresenter:
        return OutputPresenterFactory().create_presenter()
