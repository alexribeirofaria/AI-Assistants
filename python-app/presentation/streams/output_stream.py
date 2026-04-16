import sys

from presentation.interfaces.i_output_stream import IOutputStream

class OutputStream(IOutputStream):
    def __init__(self) -> None:
        self._inline_active = False
        self._last_inline_length = 0
    
    def write(self, content: str) -> None:
        if self._inline_active:
            sys.stdout.write("\n")
            sys.stdout.flush()
            self._inline_active = False
            self._last_inline_length = 0

        sys.stdout.write(content + "\n")
        sys.stdout.flush()

    def write_inline(self, content: str) -> None:
        padded_content = content.ljust(self._last_inline_length)
        sys.stdout.write(f"\r{padded_content}")
        sys.stdout.flush()
        self._inline_active = True
        self._last_inline_length = len(content)

    def clear_inline(self) -> None:
        if not self._inline_active:
            return

        sys.stdout.write("\r" + (" " * self._last_inline_length) + "\r")
        sys.stdout.flush()
        self._inline_active = False
        self._last_inline_length = 0
