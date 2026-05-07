# <img src="https://images.icon-icons.com/2088/PNG/512/br_icon_128192.png" width="16"> AI-Assistants em Português

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![Angular](https://img.shields.io/badge/Angular-Frontend-red)](https://angular.io/)
[![GitHub](https://img.shields.io/github/license/alexribeirofaria/AI-Assistants)](https://github.com/alexribeirofaria/AI-Assistants/blob/main/LICENSE)

**Versão em inglês:** [README](.github/README.md)

Projeto modular para integração com múltiplos modelos de IA (LLMs), permitindo interação via:

- CLI (Console)
- API REST
- Interface Web Angular

O projeto suporta atualmente:

- OpenAI
- Google Gemini
- Anthropic Claude
- Groq
- LangChain (abstração e orquestração)

Construído utilizando:

- Domain-Driven Design (DDD)
- Clean Architecture
- SOLID
- Orientação a Objetos (O.O.)
- Estratégias e fábricas extensíveis

---

# 📌 Objetivo do Projeto

O objetivo do **AI-Assistants** é fornecer uma camada unificada para comunicação com diferentes provedores de IA, permitindo:

- Troca de modelos sem impacto no core
- Arquitetura extensível
- Separação clara entre frontend e backend
- Execução local via terminal
- Exposição de API REST
- Interface moderna via Angular
- Fallback inteligente entre provedores
- Facilidade para adicionar novos modelos e features

---

# 🏗 Arquitetura

O projeto segue princípios de:

- Domain-Driven Design (DDD)
- Clean Architecture
- SOLID
- Clean Code
- Tipagem forte (Python typing + TypeScript)
- Separação de responsabilidades
- Injeção de dependência
- Estratégias e fábricas extensíveis

---

# 📂 Estrutura Geral

```text
AI-Assistants/
│
├── python-app/              # Backend Python
│   ├── src/
│   │   ├── web/             # Web API Rest
│   │   ├── domain/          # Domínios
│   │   ├── application/     # Estratégias e casos de uso
│   │   ├── infrastructure/  # Clientes externos e factories
│   │   ├── presentation/    # Interface e saída
│   │   ├── repository/      # DI e repositórios
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── angular-app/             # Frontend Angular
│   ├── src/
│   ├── e2e/
│   ├── tests/
│   └── package.json
│
└── README.md
````

---

# 🔄 Fluxo da Aplicação

```text
Usuário (Angular / CLI)
        ↓
Gateway Core
        ↓
 Abstraction
        ↓
Backend Python (Fallback HTTP)
        ↓
LLMs Providers
(OpenAI, Gemini, Claude, Groq)
        ↓
Resposta retornada ao usuário
```

---

# 🚀 Funcionalidades

## 🤖 Suporte Multi-Modelo

* OpenAI
* Claude (Anthropic)
* Gemini (Google)
* Groq
* LangChain

---

## 💻 CLI Interativa

Comandos disponíveis:

```text
/list-models
/switch-model <nome>
/clear
/exit
```

---

## 🌐 API REST

* Backend HTTP
* Fallback entre provedores
* Abstração dos modelos
* Preparado para streaming

---

## 🅰️ Frontend Angular

* Interface moderna
* Integração com múltiplos gateways
* Prompt mode
* SSR support
* Estrutura preparada para Chat UI

---

## ⚡ Recursos Técnicos

* Cache com expiração
* Execução assíncrona
* Operações threaded
* Estratégias extensíveis
* Fácil adição de novos providers
* Arquitetura desacoplada

---

# 📦 Instalação

## 1. Clone o repositório

```bash
git clone https://github.com/alexribeirofaria/AI-Assistants.git

cd AI-Assistants
```

---

# 🐍 Backend Python

Localizado em:

```text
/python-app
```

---

## 2. Instale as dependências

```bash
cd python-app

pip install -r requirements.txt
```

---

## 3. Configure o ambiente

```bash
cp src/.env.example .env
```

Edite o arquivo `.env`:

```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
```

---

## ▶ Modos de Execução

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

# 🅰️ Frontend Angular

Localizado em:

```text
/angular-app
```

---

## ▶ Instalação

```bash
cd angular-app

npm install
```

---

## ▶ Execução

```bash
npm run start
```

---

## 💬 Prompt Mode

```bash
npm run prompt
```

---

## 🧪 Testes

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

# 💻 Exemplo de Uso CLI

```bash
$ python src/main.py --app console

> Olá, IA!

[Resposta da IA streamada aqui...]

> /switch-model claude

Trocado para Claude.

> /list-models

openai
claude
gemini
groq

> /exit
```

---

# 🧩 Responsabilidades do Backend

* Gateway de acesso aos LLMs
* Orquestração de chamadas
* Fallback entre provedores
* Exposição de API REST
* Streaming de respostas
* Execução via console CLI
* Gerenciamento de cache
* Estratégias de comunicação

---

# 🔄 Integração entre Sistemas

O frontend Angular pode consumir o backend utilizando:

## 1. Gateway Core (Principal)

Comunicação direta com abstrações da aplicação.

---

## 2. API Python (Fallback HTTP)

Fallback resiliente para múltiplos provedores.

---

# 🧠 Conceito Principal de Fallback

```text
1. Core Gateway (principal)
2. LangChain abstraction
3. API Python fallback
```

---

# 🧪 Qualidade de Código

O projeto utiliza:

* Clean Code
* SOLID
* DDD
* Clean Architecture
* Tipagem forte
* Arquitetura em camadas
* Separação de responsabilidades
* Injeção de dependência

---

# 🚧 Status do Projeto

Atualmente em desenvolvimento contínuo:

* Streaming token-by-token
* Memória contextual
* Sistema de agentes
* Plugins de LLM
* Observabilidade e tracing
* Testes avançados de UI
* Testes de carga
* UI estilo ChatGPT

---

# 🚀 Futuras Melhorias

* Multi-agent orchestration
* Memória por usuário
* Function calling
* Plugins dinâmicos
* Persistência contextual
* Telemetria
* Dashboard administrativo
* Monitoramento de tokens
* Balanceamento entre providers

---

# ❓ Por que usar?

* Utilize múltiplos modelos de IA em um único sistema
* Troque de provider sem alterar o core
* Arquitetura preparada para expansão
* Backend desacoplado do frontend
* Fácil integração com novos LLMs
* Estrutura escalável para aplicações modernas

---

# 👨‍💻 Autor

Projeto criado para estudo avançado de:

* Arquitetura de software
* Sistemas distribuídos
* Integração com LLMs
* Backend escalável em Python
* Frontend moderno com Angular
* Padrões arquiteturais avançados

---

# 🆘 Suporte

* Abra uma issue:
  https://github.com/alexribeirofaria/AI-Assistants/issues

* Discussões:
  https://github.com/alexribeirofaria/AI-Assistants/discussions

---

# 📄 Licença

MIT — veja [LICENSE](LICENSE)
