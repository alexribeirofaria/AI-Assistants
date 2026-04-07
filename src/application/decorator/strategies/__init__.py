# Caso não for realizado o import de forma explícita, o Python não irá reconhecer os arquivos como parte do pacote e não conseguirá importar as classes e funções corretamente.
# Para garantir que os arquivos sejam reconhecidos como parte do pacote, é necessário realizar o import de forma explícita, mesmo que seja apenas para garantir a estrutura do pacote.
# Além disso, o uso de importações explícitas ajuda a evitar problemas de importação circular e torna o código mais claro e fácil de entender.
from .exit_strategy import * # noqa: F403
from .clear_strategy import * # noqa: F403
from .list_models_strategy import * # noqa: F403
from .switch_model_strategy import * # noqa: F403
from .message_strategy import * # noqa: F403
from .help_strategy import * # noqa: F403  
