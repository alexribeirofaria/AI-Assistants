import threading
import time
from queue import Queue

class ThreadHelper:
    """
    Controla threads workers para processar tarefas do assistente AI.
    """
    def __init__(self, queue: Queue, presenter):
        self._queue = queue
        self._presenter = presenter
        self.running = True
        self.threads: list[threading.Thread] = []
        self._threads_started = False

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
            self._queue.put(None)
        for t in self.threads:
            t.join()
        self._threads_started = False

    def _worker(self):
        while self.running:
            item = self._queue.get()
            if item is None:
                break
            kind, strategy, payload = item

            if kind == "message":
                response = strategy.execute(payload)
                domain = getattr(strategy, "domain", None)
                domain_name = getattr(domain, "name", None) or strategy.__class__.__name__
                self._presenter.show_response(domain_name, response)

            elif kind == "list_models":
                self._presenter.show_loading_models()
                header, names, prefix = strategy.list_domains()
                self._presenter.show_model_list(header, names, prefix)

            else:
                self._presenter.show_warning(f"Task desconhecida: {kind}")

            self._queue.task_done()

    def enqueue_task(self, kind: str, strategy, payload: str | None):
        self.start_threads(num_threads=1)
        self._queue.put((kind, strategy, payload))

    def show_elapsed_time_until_queue_finishes(self):
        stop_event = threading.Event()

        def _update_elapsed_time() -> None:
            started_at = time.monotonic()
            while not stop_event.is_set():
                elapsed_seconds = int(time.monotonic() - started_at)
                minutes, seconds = divmod(elapsed_seconds, 60)
                self._presenter.show_elapsed_time(minutes, seconds)
                if stop_event.wait(1):
                    break

        timer_thread = threading.Thread(target=_update_elapsed_time, daemon=True)
        timer_thread.start()
        try:
            self._queue.join()
        finally:
            stop_event.set()
            timer_thread.join()
            self._presenter.clear_elapsed_time()