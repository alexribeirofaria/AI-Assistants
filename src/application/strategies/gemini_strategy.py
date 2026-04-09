from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy
from domain.abstracts.domain_type import DomainType
from domain.gemini_domain import Gemini

class GeminiStrategy(BaseApplicationStrategy):

    def __init__(self):
        super().__init__(domain=Gemini)
        self.domain_type = DomainType.Gemini