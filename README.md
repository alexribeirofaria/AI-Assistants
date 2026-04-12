<div dir="auto">
# <link rel="icon" href="https://twemoji.maxcdn.com/v/latest/svg/1f1e7-1f1f7.svg"> AI-Assistants

# AI-Assistants 🧠🤖

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/license/yourusername/AI-Assistants)](https://github.com/yourusername/AI-Assistants)

Aplicação CLI modular em Python para interação perfeita com múltiplos modelos de IA: OpenAI, Claude (Anthropic), Gemini (Google) e Groq. Construída com Design Driven by Domain (DDD), padrões de estratégia e fábricas extensíveis para troca fácil de modelos e recursos avançados como interpretadores e cache.

## Início Rápido

1. Clone o repositório:
   ```
   https://github.com/alexribeirofaria/AI-Assistants.git
   cd AI-Assistants
   ```

2. Instale dependências:
   ```
   pip install -r requirements.txt
   ```

3. Copie exemplo de env:
   ```
   cp src/.env.example .env
   ```
   Edite `.env` com suas chaves de API (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.).

4. Execute:
   ```
   python src/console_app.py
   ```

## Funcionalidades
- **Suporte Multi-Modelo**: Troque entre OpenAI, Claude, Gemini, Groq.
- **Comandos de Interpretador**: `/list-models`, `/switch-model <nome>`, `/clear`, `/exit`.
- **Cache**: Cache de valores expiráveis e listas de domínio.
- **Helpers Threaded**: Operações não-bloqueantes.
- **Arquitetura Extensível**: Fábricas, estratégias, repositórios.

## Exemplo de Uso
```
$ python src/console_app.py
> Olá, IA!
[Resposta da IA streamada aqui...]
> /switch-model claude
Trocado para Claude.
> /exit
```

## Arquitetura
```
src/
├── domain/     # Domínios de modelo & cache
├── application/ # Estratégias, helpers, interpretadores
├── infrastructure/ # Clientes & fábricas
├── presentation/ # Manipulação de saída
├── repository/ # Registro DI
└── console_app.py
```

## Contribuições
Fork, crie uma branch, envie PR para `main`. Veja [CONTRIBUTING.md](#) para detalhes.

## Licença
Licença MIT - veja arquivo [LICENSE](LICENSE).
<details>
<summary>en README.en.md em Inglês (EN)</summary>

</details>