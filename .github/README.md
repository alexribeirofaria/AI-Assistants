## <img src="https://www.eccobandeiras.com.br/image/cache/catalog/antigas/reino-unido-1111x740.jpg" width="16"> AI-Assistants in English

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/license/alexribeirofaria/AI-Assistants)](https://github.com/alexribeirofaria/AI-Assistants/license.md)

**Versão em português:** [README](../README.md)

A modular Python CLI application for seamless interaction with multiple AI models: OpenAI, Claude (Anthropic), Gemini (Google), and Groq. Built with Domain-Driven Design (DDD), strategy patterns, and extensible factories for easy model switching and advanced features like interpreters and caching.

## Quick Start

1. Clone the repo:
   ```
   git clone https://github.com/alexribeirofaria/AI-Assistants.git
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
   python src/main.py --app console to run terminal app

   python src/main.py --app web to run web server app
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

## Why Use It?
This project is useful because:
- Allows testing and using multiple AI models in one CLI without tool switching.
- DDD architecture facilitates extensions (new models, features).
- Cache and threaded helpers improve performance.
- Easy setup and quick start.

## Help and Support
- Create an [issue](https://github.com/alexribeirofaria/AI-Assistants/issues) for bugs or features.
- Check code or [discussions](https://github.com/alexribeirofaria/AI-Assistants/discussions).

## License
MIT License - see [LICENSE](license.md).
