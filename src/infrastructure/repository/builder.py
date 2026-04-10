# src/infrastructure/repository/builder.py
import logging
from typing import Any, Optional, Type

logger = logging.getLogger(__name__)

class Builder:
    def __init__(self, domain_cls: Type, servers_factory: Optional[Any] = None, server_instance: Optional[Any] = None):
        self._domain_cls = domain_cls
        self._server = None

        # Se o caller já passou um server pronto, use-o
        if server_instance is not None:
            self._server = server_instance
            logger.debug("Builder: usando server_instance fornecido: %r", self._server)
            return

        # Valida e normaliza servers_factory: aceita classe ou instância
        if servers_factory is None:
            raise RuntimeError("Builder: 'servers_factory' ou 'server_instance' deve ser fornecido")

        # Se foi passada uma classe, instancie-a
        if isinstance(servers_factory, type):
            try:
                servers_factory = servers_factory()
                logger.debug("Builder: instanciada factory a partir da classe: %r", servers_factory)
            except Exception as exc:
                logger.exception("Falha ao instanciar factory a partir da classe")
                raise RuntimeError("Falha ao instanciar servers_factory") from exc

        # Agora servers_factory deve ser um objeto com build_server ou create_factory
        if hasattr(servers_factory, "build_server") and callable(getattr(servers_factory, "build_server")):
            try:
                # build_server deve retornar um cliente/servidor pronto
                self._server = servers_factory.build_server()
                logger.debug("Builder: servidor criado via build_server: %r", self._server)

            except Exception:
                logger.exception("Erro ao chamar servers_factory.build_server")
                raise
        elif hasattr(servers_factory, "create_factory") and callable(getattr(servers_factory, "create_factory")):
            try:
                # create_factory pode retornar o cliente diretamente
                self._server = servers_factory.create_factory()
                logger.debug("Builder: servidor criado via create_factory: %r", self._server)
            except Exception:
                logger.exception("Erro ao chamar servers_factory.create_factory")
                raise
        else:
            raise RuntimeError("servers_factory não possui build_server nem create_factory")

    def build_domain(self):
        if self._server is None:
            raise RuntimeError("Builder: servidor não inicializado")
        # Instancia o domínio com o cliente/server criado
        return self._domain_cls(server=self._server, model_name=self._domain_cls.get_domain_name())
