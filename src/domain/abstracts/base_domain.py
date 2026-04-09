from abc import ABC, abstractmethod
from google.genai.errors import ClientError
from anthropic import RateLimitError
from openai import APIError, OpenAIError
from domain.abstracts.domain_type import DomainType
from domain.cache.domain_list_cache import CachedDomainListMixin

class BaseDomain(ABC, CachedDomainListMixin):
    _SUFFIXES = ("domain", "client", "service")

    def __init__(self, client, model_name) :
        self.client = client
        self.model_name = model_name
        self.max_tokens = 512
        self.model = None
        CachedDomainListMixin.__init__(self)

    def set_max_tokens(self, max_tokens: int):        
        self.max_tokens = max_tokens

    def set_model(self, model: str):        
        self.model = model

    def set_language(self, language: str):        
        self.language = language

    @abstractmethod
    def send_message(self, prompt: str) -> str:        
        pass

    @abstractmethod
    def list_models(self) -> tuple[str, list[str], str]:
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
    def _matches_domain_type(cls, name: str, domain_type: DomainType) -> bool:
        enum_name = cls._sanitize(domain_type.name.strip().lower())
        enum_value = cls._sanitize(domain_type.value.strip().lower())

        return name == enum_name or name == enum_value

    @classmethod
    def get_domain_type(cls) -> DomainType:
        name = cls.__name__.strip().lower()

        for suffix in ("domain", "client", "service"):
            if name.endswith(suffix):
                name = name.removesuffix(suffix)

        name = name.replace("_", "").replace(" ", "")

        for action in DomainType:
            enum_name = action.name.strip().lower()
            enum_value = action.value.strip().lower().replace(" ", "")

            if name == enum_name or name == enum_value:
                return action

        raise ValueError(f"DomainType não encontrado para classe: {cls.__name__}")

    @classmethod
    def get_domain_name(cls) -> str:
        return cls._normalize_class_name()

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
