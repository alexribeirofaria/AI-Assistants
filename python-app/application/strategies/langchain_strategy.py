from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy
from domain.langchain_domain import LangChain

class LangChainStrategy(BaseApplicationStrategy):

    def __init__(self):
        super().__init__(domain=LangChain)
            
