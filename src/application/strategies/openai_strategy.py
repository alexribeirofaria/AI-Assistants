from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy
from domain.abstracts.domain_type import DomainType
from domain.openai_domain import OpenAI

class OpenAIStrategy(BaseApplicationStrategy):

    def __init__(self):
        super().__init__( domain=OpenAI)
        self.domain_type = DomainType.OpenAI
            
