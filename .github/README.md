# <img src="https://www.eccobandeiras.com.br/image/cache/catalog/antigas/reino-unido-1111x740.jpg" width="16"> AI-Assistants in English

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![GitHub](https://img.shields.io/github/license/alexribeirofaria/AI-Assistants)](https://github.com/alexribeirofaria/AI-Assistants/blob/main/LICENSE)

**Versão em português:** [README](../README.md)

A modular Python CLI application for seamless interaction with multiple AI models: OpenAI, Claude (Anthropic), Gemini (Google), and Groq. Built with Domain-Driven Design (DDD), strategy patterns, and extensible factories for easy model switching and advanced features like interpreters and caching.

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/alexribeirofaria/AI-Assistants.git
cd AI-Assistants
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp src/.env.example .env
```

Edit `.env` with your API keys:

```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
```

### 4. Run the application

```bash
python src/main.py --app console   # Run CLI app
python src/main.py --app web       # Run web server
```

---

## ✨ Features

- **Multi-Model Support**: OpenAI, Claude, Gemini, Groq  
- **Interpreter Commands**:
  - `/list-models`
  - `/switch-model <name>`
  - `/clear`
  - `/exit`
- **Caching**: Expirable values and domain list caching  
- **Threaded Helpers**: Non-blocking operations  
- **Extensible Architecture**: Factories, strategies, repositories  

---

## 💻 Usage Example

```bash
$ python src/console_app.py
> Hello, AI!
[AI Response streamed here...]
> /switch-model claude
Switched to Claude.
> /exit
```

---

## 🏗 Architecture

```
src/
├── domain/          # Model domains & cache
├── application/     # Strategies, helpers, interpreters
├── infrastructure/  # Clients & factories
├── presentation/    # Output handling
├── repository/      # DI registry
└── console_app.py
```

---

## ❓ Why Use It?

- Use multiple AI models in a single CLI  
- DDD architecture enables easy extensions  
- Cache and threading improve performance  
- Simple setup and fast start  

---

## 🆘 Help and Support

- Create an issue: <https://github.com/alexribeirofaria/AI-Assistants/issues>  
- Check discussions: <https://github.com/alexribeirofaria/AI-Assistants/discussions>  

---

## 📄 License

MIT — see [LICENSE](../LICENSE)
