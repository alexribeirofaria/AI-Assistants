from queue import Queue
from application.abstracts.base_ai_assistant_app import BaseAIAssistantApp
from application.helpers.thread_helper import ThreadHelper

class AIAssistantApp(BaseAIAssistantApp):
    """
    Classe concreta do AI Assistant.
    """
    def __init__(self, strategy_factory=None, presenter=None, presenter_factory=None):
        super().__init__(strategy_factory=strategy_factory, presenter=presenter, presenter_factory=presenter_factory)
        self._queue: Queue | None = None
        self.thread_controller: ThreadHelper
        self.default_model_agent = "groq"
        self.strategy = None

    @property
    def queue(self) -> Queue:
        if self._queue is None:
            self._queue = Queue()
            self.thread_controller = ThreadHelper(self._queue, self.presenter)
        return self._queue

    def _get_current_strategy(self):
        if self.strategy is None:
            self.strategy = self._strategy_factory.get_strategy(self.default_model_agent)
        return self.strategy

    def run(self):
        self.presenter.show_ui()
        while True:
            if not self.queue.empty():
                self.thread_controller.show_elapsed_time_until_queue_finishes()

            prompt = input(f"{self.capitalize_first_letter(self.default_model_agent)} Chat: ")
            action, value = self._interpret_user_input(prompt, self.presenter, self.default_model_agent)

            if action == "exit":
                self.presenter.show_goodbye()
                break

            if action == "switch_model":
                self.default_model_agent = value
                self.strategy = None
                self.presenter.show_model_switched(prompt)
                continue

            if action == "list_models":
                self.thread_controller.enqueue_task("list_models", self._get_current_strategy(), None)
                continue

            if action == "cls":
                self.clear_screen()
                self.presenter.show_ui()
                continue

            self.thread_controller.enqueue_task("message", self._get_current_strategy(), prompt)