# -*- coding: utf-8 -*-
from queue import Queue
from application.abstracts.base_ai_assistant_app import BaseAIAssistantApp
from application.controller.thread_controller import ThreadController
from application.decorator.interpreter.decorator_interpreter_factory import (
    DecoratorInterpreterFactory,
)
from application.enums.user_action import UserAction
from domain.abstracts.base_domain import BaseDomain


class AIAssistantApp(BaseAIAssistantApp):
    """
    Classe concreta do AI Assistant.
    """

    def __init__(self, strategy_factory=None, presenter=None, presenter_factory=None):
        super().__init__(
            strategy_factory=strategy_factory,
            presenter=presenter,
            presenter_factory=presenter_factory,
        )
        self._queue: Queue | None = None
        self.thread_controller: ThreadController
        self.default_model_agent = self._strategy_factory.default_domain
        self.strategy = None
        self.interpreter = DecoratorInterpreterFactory.create()

    @property
    def default_model_agent(self) -> type[BaseDomain]:
        return self._default_model_agent

    @default_model_agent.setter
    def default_model_agent(self, value: type[BaseDomain]):
        if not isinstance(value, type) or not issubclass(value, BaseDomain):
            raise ValueError("default_model_agent must be a BaseDomain class")
        self._default_model_agent = value

    @property
    def queue(self) -> Queue:
        if self._queue is None:
            self._queue = Queue()
            self.thread_controller = ThreadController(self._queue, self.presenter)
        return self._queue

    def _get_current_strategy(self):
        if self.strategy is None:
            self.strategy = self._strategy_factory.get_strategy(
                self.default_model_agent
            )
        return self.strategy

    def _handle_action(self, action, value, stop_app: bool = True):
        if action == UserAction.EXIT:
            _ = self.queue
            if stop_app:
                self.thread_controller.stop_threads(wait=True)
                self.presenter.show_goodbye()
                return True
            else:
                self.thread_controller.stop_threads_non_blocking()
                return False

        if action == UserAction.SWITCH_MODEL:
            parsed = self._strategy_factory.parse_domain(value)

            if parsed:
                self.default_model_agent = parsed
                self.strategy = None
                self.presenter.show_model_switched(parsed.get_domain_name())
            else:
                self.presenter.show_invalid_model(value)

        if action == UserAction.LIST_MODELS:
            header, names, prefix = self._get_current_strategy().list_domains()
            self.presenter.show_model_list(header, names, prefix=prefix)

        if action == UserAction.CLEAR:
            self.clear_screen()
            self.presenter.show_ui()

        if action == UserAction.MESSAGE:
            _ = self.queue
            strategy = self._get_current_strategy()
            self.thread_controller.enqueue_task("message", strategy, value)

        return False

    def run_web_app(self, message):
        if not self.queue.empty():
            self.thread_controller.show_elapsed_time_until_queue_finishes()

        action, value = self.interpreter.interpret_user_input_with_feedback(
            message, self.presenter
        )

        if action == UserAction.LIST_MODELS:
            header, names, prefix = self._get_current_strategy().list_domains()
            return {"header": header, "names": names, "prefix": prefix}

        if action == UserAction.SWITCH_MODEL:
            self._handle_action(action, value, stop_app=False)
            new_model = self.default_model_agent.get_domain_name()
            return {"message": "model_switched", "model": new_model}

        strategy = self._get_current_strategy()
        prompt = (
            value if (action == UserAction.MESSAGE and value is not None) else message
        )
        response = strategy.execute(prompt)
        return {"response": response}

    def list_models(
        self,
        search_query: str | None = None,
        prefix: str | None = None,
        provider: str | None = None,
    ) -> list[str]:
        if provider:
            parsed = self._strategy_factory.parse_domain(provider)
            if parsed is None:
                raise ValueError(f"Invalid provider '{provider}'")
            strategy = self._strategy_factory.get_strategy(parsed)
        else:
            strategy = self._get_current_strategy()

        header, names, _ = strategy.list_domains()

        if prefix:
            normalized_prefix = prefix.strip().lower()
            names = [
                name for name in names if name.lower().startswith(normalized_prefix)
            ]

        if search_query:
            normalized = search_query.strip().lower()
            names = [name for name in names if normalized in name.lower()]

        return names

    def get_default_model(self, provider: str | None = None) -> str | None:
        """Retorna o modelo padrão para o provider especificado."""
        try:
            if provider:
                domain_class = self._strategy_factory.parse_domain(provider)
                if domain_class is None:
                    return None
            else:
                domain_class = self.default_model_agent
            
            domain_instance = self._strategy_factory.get_strategy(domain_class).ensure_domain()
            return domain_instance.model
        except Exception:
            return None

    def get_available_providers(self) -> tuple[type[BaseDomain], ...]:
        return self._strategy_factory.available()

    def set_provider(self, provider: str) -> None:
        parsed = self._strategy_factory.parse_domain(provider)
        if parsed is None:
            raise ValueError(f"Invalid provider '{provider}'")
        self.default_model_agent = parsed
        self.strategy = None

    def run_console_app(self):
        self.presenter.show_ui()

        while True:
            if not self.queue.empty():
                self.thread_controller.show_elapsed_time_until_queue_finishes()

            prompt = input(f"{self.default_model_agent.get_domain_name()} Chat: ")

            action, value = self.interpreter.interpret_user_input_with_feedback(
                prompt, self.presenter
            )

            should_exit = self._handle_action(action, value)
            if should_exit:
                break

