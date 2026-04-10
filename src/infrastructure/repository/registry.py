import logging
from typing import Callable, Dict, Optional, Tuple
from domain.langchain_domain import LangChain
from domain.openai_domain import OpenAI
from domain.claude_domain import Claude
from domain.gemini_domain import Gemini
from domain.groq_domain import Groq
from infrastructure.repository.builder import Builder
from infrastructure.servers.factories.anthropic_server_factory import AnthropicServerFactory
from infrastructure.servers.factories.gemini_server_factory import GeminiServerFactory
from infrastructure.servers.factories.groq_server_factory import GroqServerFactory
from infrastructure.servers.factories.langchain_server_factory import LangChainServerFactory
from infrastructure.servers.factories.openai_server_factory import OpenAIServerFactory

logger = logging.getLogger(__name__)


class Registry:
    """
    Registry que fornece providers para construção de domínios.
    Cada provider é um callable que retorna um Builder pronto para uso.
    """

    def __init__(self):
        # providers: mapeamento domain_name -> callable que retorna um Builder
        # As factories são instanciadas aqui (não passamos classes).
        self.default_domain = LangChain
        self._providers: Dict[str, Callable[[], Builder]] = {
            "LangChain": lambda: Builder(
                domain_cls=LangChain,
                servers_factory=LangChainServerFactory()
            ),
            "OpenAI": lambda: Builder(
                domain_cls=OpenAI,
                servers_factory=OpenAIServerFactory()
            ),
            "Claude": lambda: Builder(
                domain_cls=Claude,
                servers_factory=AnthropicServerFactory()
            ),
            "Gemini": lambda: Builder(
                domain_cls=Gemini,
                servers_factory=GeminiServerFactory()
            ),
            "Groq": lambda: Builder(
                domain_cls=Groq,
                servers_factory=GroqServerFactory()
            ),
        }
        logger.debug("Registry inicializado com providers: %r", list(self._providers.keys()))

    def create(self, domain_name: str) -> Builder:
        """
        Cria e retorna um Builder para o domínio solicitado.
        """
        provider = self._providers.get(domain_name)
        if provider is None:
            raise RuntimeError(f"Registry: provider não encontrado para domínio '{domain_name}'")
        builder = provider()
        return builder

    def get_provider(self, domain_name: str) -> Optional[Callable[[], Builder]]:
        """
        Retorna o provider callable para o nome informado, ou None se não existir.
        """
        return self._providers.get(domain_name)

    def has_domain(self, domain_name: str) -> bool:
        """
        Verifica se existe provider registrado para o nome informado.
        """
        return domain_name in self._providers

    def available_domains(self) -> Tuple[str, ...]:
        """
        Retorna os nomes dos domínios/providers disponíveis.
        """
        return tuple(self._providers.keys())

    def register(self, domain_name: str, provider: Callable[[], Builder]) -> None:
        """
        Registra um novo provider.
        domain_name: nome textual do domínio (ex: "OpenAI", "LangChain")
        provider: callable que retorna um Builder quando chamado
        """
        if not callable(provider):
            raise ValueError("provider deve ser um callable que retorna um Builder")
        self._providers[domain_name] = provider
        logger.debug("Registry: provider '%s' registrado", domain_name)

