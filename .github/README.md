# <img src="https://www.eccobandeiras.com.br/image/cache/catalog/antigas/reino-unido-1111x740.jpg" width="16"> AI-Assistants in English

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![Angular](https://img.shields.io/badge/Angular-Frontend-red)](https://angular.io/)
[![GitHub](https://img.shields.io/github/license/alexribeirofaria/AI-Assistants)](https://github.com/alexribeirofaria/AI-Assistants/blob/main/LICENSE)

**Portuguese version:** [README](../README.md)

Modular project for integrating multiple AI models (LLMs), allowing interaction through:

- CLI (Console)
- REST API
- Angular Web Interface

The project currently supports:

- OpenAI
- Google Gemini
- Anthropic Claude
- Groq
- LangChain (abstraction and orchestration)

Built using:

- Domain-Driven Design (DDD)
- Clean Architecture
- SOLID
- Object-Oriented Programming (O.O.P.)
- Extensible strategies and factories

---

# 📌 Project Goal

The goal of **AI-Assistants** is to provide a unified layer for communication with different AI providers, allowing:

- Model switching without impacting the core
- Extensible architecture
- Clear separation between frontend and backend
- Local terminal execution
- REST API exposure
- Modern Angular interface
- Intelligent provider fallback
- Easy addition of new models and features

---

# 🏗 Architecture

The project follows principles of:

- Domain-Driven Design (DDD)
- Clean Architecture
- SOLID
- Clean Code
- Strong typing (Python typing + TypeScript)
- Separation of concerns
- Dependency injection
- Extensible strategies and factories

---

# 📂 General Structure

```text
AI-Assistants/
│
├── python-app/              # Python Backend
│   ├── src/
│   │   ├── web/             # REST Web API
│   │   ├── domain/          # Domains
│   │   ├── application/     # Strategies and use cases
│   │   ├── infrastructure/  # External clients and factories
│   │   ├── presentation/    # Interface and output
│   │   ├── repository/      # DI and repositories
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── angular-app/             # Angular Frontend
│   ├── src/
│   ├── e2e/
│   ├── tests/
│   └── package.json
│
└── README.md
````

---

# 🔄 Application Flow

```text
User (Angular / CLI)
        ↓
Gateway Core
        ↓
Abstraction
        ↓
Python Backend (HTTP Fallback)
        ↓
LLMs Providers
(OpenAI, Gemini, Claude, Groq)
        ↓
Response returned to the user
```

---

# 🚀 Features

## 🤖 Multi-Model Support

* OpenAI
* Claude (Anthropic)
* Gemini (Google)
* Groq
* LangChain

---

## 💻 Interactive CLI

Available commands:

```text
/list-models
/switch-model <name>
/clear
/exit
```

---

## 🌐 REST API

* HTTP Backend
* Provider fallback
* Model abstraction
* Streaming-ready

---

## 🅰️ Angular Frontend

* Modern interface
* Multiple gateway integration
* Prompt mode
* SSR support
* Chat UI-ready structure

---

## ⚡ Technical Features

* Expiring cache
* Asynchronous execution
* Threaded operations
* Extensible strategies
* Easy provider integration
* Decoupled architecture

---

# 📦 Installation

## 1. Clone the repository

```bash
git clone https://github.com/alexribeirofaria/AI-Assistants.git

cd AI-Assistants
```

---

# 🐍 Python Backend

Located at:

```text
/python-app
```

---

## 2. Install dependencies

```bash
cd python-app

pip install -r requirements.txt
```

---

## 3. Configure environment

```bash
cp src/.env.example .env
```

Edit the `.env` file:

```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
```

---

## ▶ Execution Modes

### Console Mode (CLI)

```bash
python src/main.py --app console
```

---

### API Server Mode

```bash
python src/main.py --app web
```

---

# 🅰️ Angular Frontend

Located at:

```text
/angular-app
```

---

## ▶ Installation

```bash
cd angular-app

npm install
```

---

## ▶ Run

```bash
npm run start
```

---

## 💬 Prompt Mode

```bash
npm run prompt
```

---

## 🧪 Tests

### Coverage

```bash
npm run coverage
```

---

### E2E

```bash
npm run e2e
```

---

### SSR

```bash
npm run ssr
```

---

# 💻 CLI Usage Example

```bash
$ python src/main.py --app console

> Hello, AI!

[AI response streamed here...]

> /switch-model claude

Switched to Claude.

> /list-models

openai
claude
gemini
groq

> /exit
```

---

# 🧩 Backend Responsibilities

* LLM access gateway
* Request orchestration
* Provider fallback
* REST API exposure
* Response streaming
* CLI execution
* Cache management
* Communication strategies

---

# 🔄 System Integration

The Angular frontend can consume the backend using:

## 1. Gateway Core (Primary)

Direct communication with application abstractions.

---

## 2. Python API (HTTP Fallback)

Resilient fallback for multiple providers.

---

# 🧠 Main Fallback Concept

```text
1. Core Gateway (primary)
2. LangChain abstraction
3. Python API fallback
```

---

# 🧪 Code Quality

The project uses:

* Clean Code
* SOLID
* DDD
* Clean Architecture
* Strong typing
* Layered architecture
* Separation of concerns
* Dependency injection

---

# 🚧 Project Status

Currently under active development:

* Token-by-token streaming
* Contextual memory
* Agent system
* LLM plugins
* Observability and tracing
* Advanced UI testing
* Load testing
* ChatGPT-style UI

---

# 🚀 Future Improvements

* Multi-agent orchestration
* Per-user memory
* Function calling
* Dynamic plugins
* Context persistence
* Telemetry
* Administrative dashboard
* Token monitoring
* Provider balancing

---

# ❓ Why Use It?

* Use multiple AI models in a single system
* Switch providers without changing the core
* Expansion-ready architecture
* Decoupled backend/frontend
* Easy integration with new LLMs
* Scalable structure for modern applications

---

# 👨‍💻 Author

Project created for advanced study of:

* Software architecture
* Distributed systems
* LLM integration
* Scalable Python backend
* Modern Angular frontend
* Advanced architectural patterns

---

# 🆘 Support

* Open an issue:
  https://github.com/alexribeirofaria/AI-Assistants/issues

* Discussions:
  https://github.com/alexribeirofaria/AI-Assistants/discussions

---

# 📄 License

MIT — see [LICENSE](../LICENSE)
