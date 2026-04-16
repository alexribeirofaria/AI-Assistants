from __future__ import annotations
from dataclasses import dataclass, field
from threading import Lock
from typing import Callable, Generic, TypeVar
import time

T = TypeVar("T")

@dataclass
class ExpiringValueCache(Generic[T]):
    """
    Cache simples com TTL (thread-safe) para um unico valor.
    Remove o valor expirado da memoria assim que detectado.
    """

    ttl_seconds: float
    _value: T | None = None
    _ts: float | None = None
    _lock: Lock = field(default_factory=Lock)
    _hits: int = 0
    _misses: int = 0
    _evictions: int = 0

    @staticmethod
    def _now() -> float:
        return time.monotonic()

    def _is_expired(self) -> bool:
        if self._value is None or self._ts is None:
            return True
        return (self._now() - self._ts) >= self.ttl_seconds

    def _clear_unlocked(self) -> None:
        self._value = None
        self._ts = None

    def has_value(self) -> bool:
        with self._lock:
            if self._is_expired():
                if self._value is not None or self._ts is not None:
                    self._evictions += 1
                self._clear_unlocked()
                return False
            return True

    def get(self) -> T | None:
        with self._lock:
            if self._is_expired():
                if self._value is not None or self._ts is not None:
                    self._evictions += 1
                self._clear_unlocked()
                self._misses += 1
                return None
            self._hits += 1
            return self._value

    def set(self, value: T) -> None:
        with self._lock:
            self._value = value
            self._ts = self._now()

    def clear(self) -> None:
        with self._lock:
            self._clear_unlocked()

    def get_or_set(self, fetch: Callable[[], T]) -> T:
        cached = self.get()
        if cached is not None:
            return cached

        value = fetch()
        self.set(value)
        return value

    def get_stats(self) -> dict[str, int | bool]:
        with self._lock:
            return {
                "hits": self._hits,
                "misses": self._misses,
                "evictions": self._evictions,
                "has_value": self._value is not None and self._ts is not None and not self._is_expired(),
            }
