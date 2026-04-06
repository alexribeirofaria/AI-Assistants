from domain.cache.expiring_value_cache import ExpiringValueCache

class CachedDomainListMixin:
    _domain_cache_ttl_seconds = 30.0
    _domain_cache_max_items = 50

    def __init__(self):
        self._domain_cache = ExpiringValueCache[tuple[str, ...]](ttl_seconds=self._domain_cache_ttl_seconds)

    def _fetch_domain_names(self) -> list[str]:
        raise NotImplementedError

    def _get_domain_names_cached(self) -> list[str]:
        cached_names = self._domain_cache.get_or_set(self._fetch_domain_names_snapshot)
        return list(cached_names)

    def _fetch_domain_names_snapshot(self) -> tuple[str, ...]:
        names = self._fetch_domain_names()
        sanitized = {str(name).strip() for name in names if str(name).strip()}
        ordered = tuple(sorted(sanitized))
        return ordered[: self._domain_cache_max_items]

    def _get_domain_view(self, header: str, prefix: str = "- ") -> tuple[str, list[str], str]:
        names = self._get_domain_names_cached()
        return header, names, prefix

    def clear_domain_cache(self) -> None:
        self._domain_cache.clear()

    def get_domain_cache_stats(self) -> dict[str, int | bool]:
        return self._domain_cache.get_stats()
