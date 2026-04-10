from collections.abc import Sequence
from application.decorator.helpers.decorator_text_helper import DecoratorTextHelper
from application.decorator.strategies.abstracts.base_helper_strategy import BaseHelperStrategy
from application.decorator.strategies.decorator.decorator_helper_strategy import strategy
from application.enums.user_action import UserAction
from domain.abstracts.base_domain import BaseDomain
from infrastructure.repository.registry import Registry

@strategy(priority=15)
class SwitchModelStrategy(BaseHelperStrategy):
    def __init__(self):
        self._aliases = self._build_aliases()

    @staticmethod
    def _compact(value: str) -> str:
        return DecoratorTextHelper.normalize_text(value).replace(" ", "")

    def _build_aliases(self) -> dict[str, type[BaseDomain]]:
        aliases: dict[str, type[BaseDomain]] = {}
        for domain in Registry().available_domains():
            aliases[self._compact(domain.__name__)] = domain
            aliases[self._compact(domain.get_domain_name())] = domain
        return aliases

    def _resolve_domain(self, normalized: str, tokens: Sequence[str]) -> type[BaseDomain] | None:
        options = tuple(self._aliases.keys())

        for token in tokens:
            match = DecoratorTextHelper.best_match(self._compact(token), options, 0.75)
            if match:
                return self._aliases[match]

        match = DecoratorTextHelper.best_match(self._compact(normalized), options, 0.70)
        if match:
            return self._aliases[match]

        return None

    def can_handle(self, normalized: str, tokens: Sequence[str]) -> bool:
        return self._resolve_domain(normalized, tokens) is not None

    def handle(self, normalized: str, tokens: Sequence[str]):
        return UserAction.SWITCH_MODEL, self._resolve_domain(normalized, tokens)
