import os
from abc import ABC, abstractmethod
from queue import Queue
from application.strategies.factories.strategy_application_factory import StrategyApplicationFactory

class BaseAIAssistantApp(ABC):
    """
    Classe base abstrata para AI Assistant.
    Presenter deve ser fornecido pela subclasse ou via factory.
    """
    def __init__(self,
        strategy_factory: StrategyApplicationFactory | None = None,
        presenter=None,
        presenter_factory=None):
        self._strategy_factory = strategy_factory or StrategyApplicationFactory()
        self._presenter_factory = presenter_factory
        self._presenter = presenter
        self._queue: Queue | None = None
        self.thread_controller = None
        self.strategy = None

    @property
    def presenter(self):
        if self._presenter is None:
            self._presenter = self._build_presenter(self._presenter, self._presenter_factory)
        return self._presenter

    @staticmethod
    def _build_presenter(presenter, presenter_factory):
        if presenter is not None:
            return presenter
        if presenter_factory is None:
            presenter_factory = BaseAIAssistantApp._create_default_presenter_factory()
        return presenter_factory.create_presenter()

    @staticmethod
    def _create_default_presenter_factory():
        from presentation.factories.output_presenter_factory import OutputPresenterFactory
        return OutputPresenterFactory()

    def clear_screen(self):
        os.system("cls" if os.name == "nt" else "clear")

    @abstractmethod
    def run_console_app(self):
        """Deve ser implementado na subclasse concreta"""
        pass
    
    @abstractmethod
    def _handle_action(self, action, value):
        pass