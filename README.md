# <img src="https://images.icon-icons.com/2088/PNG/512/br_icon_128192.png" width="16"> AI-Assistants em Português

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![GitHub](https://img.shields.io/github/license/alexribeirofaria/AI-Assistants)](https://github.com/alexribeirofaria/AI-Assistants/blob/main/LICENSE)

**Versão em inglês:** [README](.github/README.md)

Aplicação CLI modular em Python para interação com múltiplos modelos de IA: OpenAI, Claude (Anthropic), Gemini (Google) e Groq. Construída com Domain-Driven Design (DDD), padrões de estratégia e fábricas extensíveis para facilitar a troca de modelos e adicionar novos recursos.

---

## 📦 Instalação

```bash
git clone https://github.com/alexribeirofaria/AI-Assistants.git
cd AI-Assistants
```

### 2. Instale as dependências

```bash
pip install -r requirements.txt
```

### 3. Configure o ambiente

```bash
cp src/.env.example .env
```

Edite o arquivo `.env` com suas chaves de API:

```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
```

### 4. Executar aplicação

```bash
python src/main.py --app console   # Terminal (CLI)
python src/main.py --app web       # Servidor web
```

---

## 🚀 Funcionalidades

- **Suporte Multi-Modelo**: OpenAI, Claude, Gemini, Groq  
- **Comandos de CLI**:
  - `/list-models`
  - `/switch-model <nome>`
  - `/clear`
  - `/exit`
- **Cache**: Armazenamento com expiração  
- **Execução assíncrona (threaded)**: Operações não bloqueantes  
- **Arquitetura extensível**: Fácil adicionar novos modelos e features  

---

## 💻 Exemplo de Uso

```bash
$ python src/console_app.py
> Olá, IA!
[Resposta da IA streamada aqui...]
> /switch-model claude
Trocado para Claude.
> /exit
```

---

## 🏗 Arquitetura

```
src/
├── domain/          # Domínios (modelo, cache)
├── application/     # Estratégias, helpers, interpretadores
├── infrastructure/  # Clientes e fábricas
├── presentation/    # Saída e interface
├── repository/      # Injeção de dependência
└── console_app.py
```

---

## ❓ Por que usar?

- Use múltiplos modelos de IA em um único CLI  
- Arquitetura baseada em DDD facilita expansão  
- Melhor desempenho com cache e threads  
- Setup simples e rápido  

---

## 🆘 Suporte

- Abra uma issue: <https://github.com/alexribeirofaria/AI-Assistants/issues>  
- Veja discussões: <https://github.com/alexribeirofaria/AI-Assistants/discussions>  

---

## 📄 Licença

MIT — veja [LICENSE](LICENSE)
