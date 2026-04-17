from abc import ABC, abstractmethod
from google.genai.errors import ClientError
from anthropic import RateLimitError
from openai import APIError, OpenAIError
from domain.cache.domain_list_cache import CachedDomainListMixin
from infrastructure.servers.abstracts.i_server import IServer

class BaseDomain(ABC, CachedDomainListMixin):
    _SUFFIXES = ("domain", "service", "server")
    
    def __init__(self, server: IServer, model_name) :
        if server is None:
            raise RuntimeError("server não fornecido para BaseDomain")
        # Se for factory/wrapper, crie o cliente, senão use diretamente
        if hasattr(server, "create_factory") and callable(server.create_factory):
            self.server = server.create_factory()
        else:
            self.server = server
        self.model_name = model_name
        self.max_tokens = 512
        self.model = self.__class__.__name__
        CachedDomainListMixin.__init__(self)

    def set_max_tokens(self, max_tokens: int):        
        self.max_tokens = max_tokens

    def set_language(self, language: str):        
        self.language = language

    @abstractmethod
    def send_message(self, prompt: str) -> str:        
        pass

    @abstractmethod
    def list_models(self) -> list[str]:
        pass
    
    @abstractmethod
    def build_response_messages(self, response) -> str:
        pass

    @classmethod
    def _normalize_class_name(cls) -> str:
        name = cls.__name__.strip().lower()
        for suffix in cls._SUFFIXES:
            if name.endswith(suffix):
                name = name.removesuffix(suffix)
        return cls._sanitize(name)

    @staticmethod
    def _sanitize(value: str) -> str:
        return value.replace("_", "").replace(" ", "")

    @classmethod
    def get_domain_name(cls) -> str:
        name = cls._normalize_class_name()
        return name[0].upper() + name[1:] if name else ""
    
    def send(self, model_call_fn) -> str:
        print(f"\nEnviando mensagem para modelo usando provider {self.model_name} com modelo '{self.model}'...")

        try:
            response = model_call_fn()
            if response is None:
                return  "[EMPTY RESPONSE]"
            return self.build_response_messages(response)
        
        except ClientError as e:
            return f"[CLIENT ERROR] Ocorreu um problema na API: {e}"
        except RateLimitError as e:
            return f"[QUOTA ERROR]  Limite de cota atingido. {e}"
        except APIError as e:
            return f"[API ERROR] {e}"
        except OpenAIError as e:
            return f"[GENERAL ERROR] {e}"            
        except Exception as e:
            msg = str(e)
            if "quota" in msg.lower():
                return "[QUOTA ERROR] Limite de cota atingido"
            return f"[UNKNOWN ERROR] {e}"   

