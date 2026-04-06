import difflib
import os
import re
import threading
import time
from queue import Queue
from application.strategies.factories.strategy_application_factory import StrategyApplicationFactory
from presentation.interfaces.i_output_presenter_factory import IOutputPresenterFactory
from presentation.presenters.i_output_presenter import IOutputPresenter

class AIAssistantApp:

    def __init__(
        self,
        presenter: IOutputPresenter | None = None,
        presenter_factory: IOutputPresenterFactory | None = None,
        strategy_factory: StrategyApplicationFactory | None = None,
    ):
        self._queue: Queue | None = None
        self.running = True
        self.domain = "groq"
        self.strategy = None
        self.threads = []
        self._threads_started = False
        self._presenter = presenter
        self._presenter_factory = presenter_factory
        self._strategy_factory = strategy_factory or StrategyApplicationFactory()

    @staticmethod
    def _build_presenter(
        presenter: IOutputPresenter | None,
        presenter_factory: IOutputPresenterFactory | None,
    ) -> IOutputPresenter:
        if presenter is not None:
            return presenter

        if presenter_factory is None:
            presenter_factory = AIAssistantApp._create_default_presenter_factory()

        return presenter_factory.create_presenter()

    @staticmethod
    def _create_default_presenter_factory() -> IOutputPresenterFactory:
        from presentation.factories.output_presenter_factory import (
            OutputPresenterFactory,
        )

        return OutputPresenterFactory()

    @property
    def presenter(self) -> IOutputPresenter:
        if self._presenter is None:
            self._presenter = self._build_presenter(None, self._presenter_factory)
        return self._presenter

    @property
    def queue(self) -> Queue:
        if self._queue is None:
            self._queue = Queue()
        return self._queue

    def clear_screen(self):
        os.system("cls" if os.name == "nt" else "clear")

    def _get_current_strategy(self):
        if self.strategy is None:
            self.strategy = self._strategy_factory.get_strategy(self.domain)
        return self.strategy

    @staticmethod
    def _normalize_text(text: str) -> str:
        cleaned = re.sub(r"[^a-z0-9]+", " ", (text or "").strip().lower())
        return " ".join(cleaned.split())

    @staticmethod
    def _best_match(text: str, options: list[str], cutoff: float) -> str | None:
        matches = difflib.get_close_matches(text, options, n=1, cutoff=cutoff)
        return matches[0] if matches else None

    def _interpret_user_input(self, raw: str) -> tuple[str, str | None]:
        normalized = self._normalize_text(raw)
        if not normalized:
            return ("message", None)

        tokens = normalized.split()
        # "list models" com tolerância a typos (ex.: "list modelssss", "lis modee")
        candidate = normalized.replace(" ", "")
        list_models_phrases = [
            "list models",
            "list model",
            "listmodels",
            "listmodel",
            "models",
            "modelos",
            "listar modelos",
        ]
        list_models_phrases_norm = [
            self._normalize_text(p).replace(" ", "") for p in list_models_phrases
        ]
        match = self._best_match(candidate, list_models_phrases_norm, cutoff=0.70)
        if match:
            if candidate != match:
                self.presenter.show_interpreted_input(raw, "list models")
            return ("list_models", None)

        # comandos de 1 palavra: exit/cls e troca de modelo
        if len(tokens) == 1:
            word = tokens[0]
            cmd = self._best_match(word, ["exit", "cls"], cutoff=0.75)
            if cmd:
                if word != cmd:
                    self.presenter.show_interpreted_input(raw, cmd)
                return (cmd, None)

            provider = self._best_match(
                word, ["claude", "openai", "gemini", "groq"], cutoff=0.75
            )
            if provider:
                if word != provider:
                    self.presenter.show_interpreted_input(raw, provider)
                return ("switch_model", provider)

        # fallback: tratar como mensagem normal
        return ("message", None)

    def _worker(self):
        while self.running:
            item = self.queue.get()
            if item is None:
                break
            kind, strategy, payload = item

            if kind == "message":
                response = strategy.execute(payload)
                domain = getattr(strategy, "domain", None)
                domain_name = getattr(domain, "name", None) or strategy.__class__.__name__
                self.presenter.show_response(domain_name, response)
            elif kind == "list_models":
                self.presenter.show_loading_models()
                header, names, prefix = strategy.list_domains()
                self.presenter.show_model_list(header, names, prefix)
            else:
                self.presenter.show_warning(f"Task desconhecida: {kind}")

            self.queue.task_done()

    def _show_elapsed_time_until_queue_finishes(self) -> None:
        stop_event = threading.Event()

        def _update_elapsed_time() -> None:
            started_at = time.monotonic()
            while not stop_event.is_set():
                elapsed_seconds = int(time.monotonic() - started_at)
                minutes, seconds = divmod(elapsed_seconds, 60)
                self.presenter.show_elapsed_time(minutes, seconds)
                if stop_event.wait(1):
                    break

        timer_thread = threading.Thread(target=_update_elapsed_time, daemon=True)
        timer_thread.start()

        try:
            self.queue.join()
        finally:
            stop_event.set()
            timer_thread.join()
            self.presenter.clear_elapsed_time()

    def start_threads(self, num_threads=1):
        if self._threads_started:
            return

        self.threads = []
        for _ in range(num_threads):
            t = threading.Thread(target=self._worker, daemon=True)
            t.start()
            self.threads.append(t)
        self._threads_started = True

    def stop_threads(self):
        if not self._threads_started:
            return

        self.running = False
        for _ in self.threads:
            self.queue.put(None)
        for t in self.threads:
            t.join()
        self._threads_started = False

    def _enqueue_task(self, kind: str, payload: str | None) -> None:
        self.start_threads(num_threads=1)
        self.queue.put((kind, self._get_current_strategy(), payload))

    def run(self):
        self.presenter.show_ui()

        while True:
            prompt = input("You: ")
            action, value = self._interpret_user_input(prompt)

            if action == "exit":
                self.presenter.show_goodbye()
                break

            if action == "switch_model":
                self.domain = value
                self.strategy = None
                self.presenter.show_model_switched(prompt)
                continue

            if action == "list_models":
                self._enqueue_task("list_models", None)
                #self._show_elapsed_time_until_queue_finishes()
                continue
            if action == "cls":
                self.clear_screen()
                self.presenter.show_ui()
                continue

            self._enqueue_task("message", prompt)
            #self._show_elapsed_time_until_queue_finishes()