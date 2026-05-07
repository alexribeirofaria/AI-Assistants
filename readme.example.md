# AI Assistants 🤖

Projeto de integração com múltiplos LLMs (Large Language Models), permitindo interação via chat, console e API.

Atualmente suporta integração com:

- OpenAI
- Google Gemini
- Groq
- Anthropic Claude
- LangChain (orquestração e abstração de modelos)

---

## 📌 Objetivo do Projeto

O objetivo do **AI Assistants** é fornecer uma camada unificada para interação com diferentes LLMs, permitindo:

- Conversação via terminal (console mode)
- Consumo via API REST
- Interface web via Angular
- Abstração de provedores de IA
- Facilidade para troca de modelos sem impacto no core da aplicação

---

## 🧱 Arquitetura

O projeto segue princípios de:

- Domain Driven Design (DDD)
- Clean Architecture
- Orientação a Objetos (O.O.)
- Tipagem forte (TypeScript + Python typing)
- Separação entre Frontend e Backend

### Estrutura geral

```
/python-app        -> Backend Python (API + Console)
/angular-app       -> Frontend Angular
```

---

## 🔄 Fluxo da aplicação

```
Usuário (Angular)
   ↓
Gateway Core (Angular Layer)
   ↓
Backend Python (Fallback HTTP)
   ↓
LLMs (OpenAI, Gemini, Claude, Groq)
   ↓
Resposta retornada ao frontend
```

---

## 🐍 Backend (Python)

Localizado em:

```
/python-app
```

### Modos de execução

Console Mode:

```bash
python console.app.py --app console
```

API Server Mode:

```bash
python console.app.py --app web
```

---

### 🔐 Configuração (.env)

```
OPENAI_API_KEY=xxxx
GEMINI_API_KEY=xxxx
GROQ_API_KEY=xxxx
CLAUDE_API_KEY=xxxx
```

---

### 🧩 Responsabilidades do Backend

- Gateway de acesso aos LLMs
- Orquestração de chamadas
- Fallback entre provedores
- Exposição de API REST
- Execução via console CLI

---

## 🅰️ Frontend (Angular)

Localizado em:

```
/angular-app
```

### ▶ Execução

```bash
npm run start
```

### 💬 Modo Prompt

```bash
npm run prompt
```

---

### 🧪 Testes

Unitários + Coverage:

```bash
npm run coverage
```

E2E:

```bash
npm run e2e
```

SSR:

```bash
npm run ssr
```

---

## 🧪 Qualidade de Código

- Clean Code
- SOLID principles
- Tipagem forte
- Arquitetura em camadas
- Separação de responsabilidades

---

## 🔄 Integração entre sistemas

O Angular consome o backend de duas formas:

1. Gateway Core (direto)
2. API Python (fallback HTTP)

---

## 🚧 Status do Projeto

Em desenvolvimento:

- Testes de carga
- Testes de UI avançados
- Streaming de respostas
- Memória contextual
- Sistema de agentes

---

## ⚡ Quick Start

Backend:

```bash
cd python-app
python console.app.py --app web
```

Frontend:

```bash
cd angular-app
npm install
npm run start
```

---

## 🧠 Conceito principal de fallback

```
1. Core Gateway (principal)
2. LangChain abstraction
3. API Python fallback
```

---

## 📂 Estrutura de Pastas

```
/python-app
  ├── core/
  ├── domain/
  ├── infrastructure/
  ├── console.app.py
  ├── web server

/angular-app
  ├── src/
  ├── e2e/
  ├── tests/
```

---

## 🚀 Futuras melhorias

- Streaming token-by-token
- Memória por usuário
- Agentes autônomos
- Plugins de LLM
- UI estilo ChatGPT
- Observabilidade e tracing

---

## 👨‍💻 Autor

Projeto criado para estudo avançado de:

- Arquitetura de software
- Integração com LLMs
- Sistemas distribuídos
- Frontend moderno (Angular)
- Backend escalável (Python)

---

## 📄 Licença

Projeto educacional e experimental.