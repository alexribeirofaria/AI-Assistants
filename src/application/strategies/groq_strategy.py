from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy
from domain.groq_domain import Groq

class GroqStrategy(BaseApplicationStrategy):
    
    def __init__(self):
        super().__init__(domain=Groq)
