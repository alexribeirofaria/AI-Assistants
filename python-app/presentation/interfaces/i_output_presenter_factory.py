from abc import ABC, abstractmethod
from presentation.presenters.i_output_presenter import IOutputPresenter

class IOutputPresenterFactory(ABC):
    @abstractmethod
    def create_presenter(self) -> IOutputPresenter:
        pass
