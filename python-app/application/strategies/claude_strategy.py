from application.strategies.abstracts.base_application_strategy import BaseApplicationStrategy
from domain.claude_domain import Claude

class ClaudeStrategy(BaseApplicationStrategy):

    def __init__(self):
        super().__init__(domain=Claude)
        
