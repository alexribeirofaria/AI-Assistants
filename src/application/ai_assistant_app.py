from queue import Queue
from application.abstracts.base_ai_assistant_app import BaseAIAssistantApp
from application.decorator.interpreter.decorator_interpreter_factory import DecoratorInterpreterFactory
from application.enums.user_action import UserAction
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
        self.interpreter = DecoratorInterpreterFactory.create()

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
    
    def _handle_action(self, action, value, stop_app: bool = True):
        if action == UserAction.EXIT:
            # ensure thread controller exists
            _ = self.queue
            if stop_app:
                # console shutdown: block until workers stop, then show goodbye
                self.thread_controller.stop_threads(wait=True)
                self.presenter.show_goodbye()
                return True
            else:
                # web/contextual: stop workers asynchronously, don't shut down app
                self.thread_controller.stop_threads_non_blocking()
                return False

        if action == UserAction.SWITCH_MODEL:
            new_model = (value or "").strip().lower()            
            if new_model:
                self.default_model_agent = new_model
                self.strategy = None
                self.presenter.show_model_switched(new_model)
                
        if action == UserAction.LIST_MODELS:
            header, names, prefix = self._get_current_strategy().list_domains()
            self.presenter.show_model_list(header, names, prefix=prefix)

        if action == UserAction.CLEAR:
            self.clear_screen()
            self.presenter.show_ui()

        if action == UserAction.MESSAGE:
            _ = self.queue
            self.thread_controller.enqueue_task(
                "message",
                self._get_current_strategy(),
                value
            )

        return False

    def run_web_app(self, message):
        # show elapsed time if there are pending tasks
        if not self.queue.empty():
            self.thread_controller.show_elapsed_time_until_queue_finishes()

        action, value = self.interpreter.interpret_user_input_with_feedback(
            message, self.presenter
        )

        # Only explicitly execute LIST_MODELS or SWITCH_MODEL; otherwise treat as MESSAGE
        if action == UserAction.LIST_MODELS:
            header, names, prefix = self._get_current_strategy().list_domains()
            return {"header": header, "names": names, "prefix": prefix}

        if action == UserAction.SWITCH_MODEL:
            # update model (non-blocking context) and return confirmation
            self._handle_action(action, value, stop_app=False)
            new_model = (value or "").strip().lower()
            return {"message": "model_switched", "model": new_model}

        # Default to MESSAGE handling for web: execute synchronously and return
        # the model response. Use `value` if provided by interpreter, otherwise
        # fall back to the raw request message.
        strategy = self._get_current_strategy()
        prompt = value if (action == UserAction.MESSAGE and value is not None) else message
        response = strategy.execute(prompt)
        return {"response": response}

    def run_console_app(self):
        self.presenter.show_ui()

        while True:
            if not self.queue.empty():
                self.thread_controller.show_elapsed_time_until_queue_finishes()

            prompt = input(f"{self.default_model_agent} Chat: ")

            action, value =  self.interpreter.interpret_user_input_with_feedback(
            prompt,self.presenter)

            should_exit = self._handle_action(action, value)
            if should_exit:
                break