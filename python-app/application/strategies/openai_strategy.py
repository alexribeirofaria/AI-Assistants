from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy
from domain.openai_domain import OpenAI

class OpenAIStrategy(BaseApplicationStrategy):

    def __init__(self):
        super().__init__(domain=OpenAI)
            
