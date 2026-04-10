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
        registry = Registry()

        for domain_name in registry.available_domains():
            provider = registry.get_provider(domain_name)
            domain_cls = None

            if provider is not None:
                try:
                    builder = provider()
                    # o Builder deve expor a classe do domínio; tentamos acessar atributos comuns
                    domain_cls = getattr(builder, "_domain_cls", None) or getattr(builder, "domain_cls", None)
                except Exception:
                    # se falhar ao instanciar o provider, ignoramos este domínio
                    domain_cls = None

            # Se não conseguimos a classe, tentamos inferir a partir do nome (não ideal)
            if domain_cls is None:
                # pula se não for possível obter a classe concreta
                continue

            # registra aliases a partir do nome da classe e do nome do domínio (se disponível)
            try:
                cls_name = getattr(domain_cls, "__name__", None)
                if cls_name:
                    aliases[self._compact(cls_name)] = domain_cls
            except Exception:
                pass

            try:
                domain_display = getattr(domain_cls, "get_domain_name", None)
                if callable(domain_display):
                    name = domain_display()
                    if isinstance(name, str):
                        aliases[self._compact(name)] = domain_cls
            except Exception:
                pass

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
