<title><img src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" width="50">README</title>
# AI-Assistants 🧠🤖

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/license/yourusername/AI-Assistants)](https://github.com/yourusername/AI-Assistants)

## 📖 README.md in English

A modular Python CLI application for seamless interaction with multiple AI models: OpenAI, Claude (Anthropic), Gemini (Google), and Groq. Built with Domain-Driven Design (DDD), strategy patterns, and extensible factories for easy model switching and advanced features like interpreters and caching.

## Quick Start

1. Clone the repo:
   ```
   https://github.com/alexribeirofaria/AI-Assistants.git
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

## Licença
Licença MIT - veja arquivo [LICENSE](LICENSE).
<details>
<summary>🇧🇷 README.md em Português (BR)</summary>

</details>
# AI-Assistants 🧠🤖
