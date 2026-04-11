# AI-Assistants 🧠🤖

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/license/yourusername/AI-Assistants)](https://github.com/yourusername/AI-Assistants)

## 📖 README.md in English

A modular Python CLI application for seamless interaction with multiple AI models: OpenAI, Claude (Anthropic), Gemini (Google), and Groq. Built with Domain-Driven Design (DDD), strategy patterns, and extensible factories for easy model switching and advanced features like interpreters and caching.

## Quick Start

1. Clone the repo:
   ```
   git clone https://github.com/yourusername/AI-Assistants.git
   cd AI-Assistants
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Copy env example:
   ```
   cp src/.env.example .env
   ```
   Edit `.env` with your API keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.).

4. Run:
   ```
   python src/console_app.py
   ```

## Features
- **Multi-Model Support**: Switch between OpenAI, Claude, Gemini, Groq.
- **Interpreter Commands**: `/list-models`, `/switch-model <name>`, `/clear`, `/exit`.
- **Caching**: Expireable value and domain list caching.
- **Threaded Helpers**: Non-blocking operations.
- **Extensible Architecture**: Factories, strategies, repositories.

## Usage Example
```
$ python src/console_app.py
> Hello, AI!
[AI Response streamed here...]
> /switch-model claude
Switched to Claude.
> /exit
```

## Architecture
```
src/
├── domain/     # Model domains & cache
├── application/ # Strategies, helpers, interpreters
├── infrastructure/ # Clients & factories
├── presentation/ # Output handling
├── repository/ # DI registry
└── console_app.py
```

## Contributing
Fork, create a branch, PR to `main`. See [CONTRIBUTING.md](#) for details.

## License
MIT License - see [LICENSE](LICENSE) file.

---

<details>
<summary>🇧🇷 README.md em Português (BR)</summary>

# AI-Assistants 🧠🤖

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/license/yourusername/AI-Assistants)](https://github.com/yourusername/AI-Assistants)

Aplicação CLI modular em Python para interação perfeita com múltiplos modelos de IA: OpenAI, Claude (Anthropic), Gemini (Google) e Groq. Construída com Design Driven by Domain (DDD), padrões de estratégia e fábricas extensíveis para troca fácil de modelos e recursos avançados como interpretadores e cache.

## Início Rápido

1. Clone o repositório:
   ```
   git clone https://github.com/yourusername/AI-Assistants.git
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
</details>

