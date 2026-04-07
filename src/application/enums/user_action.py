from enum import Enum, auto

class UserAction(Enum):
    LIST_MODELS = auto()
    EXIT = auto()
    CLEAR = auto()
    SWITCH_MODEL = auto()
    MESSAGE = auto()