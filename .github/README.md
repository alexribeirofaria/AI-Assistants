# <img src="https://images.icon-icons.com/2088/PNG/512/br_icon_128192.png" width="16"> AI-Assistants em português

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/license/alexribeirofaria/AI-Assistants)](https://github.com/alexribeirofaria/AI-Assistants)

## Índice

- [Início Rápido](#início-rápido)
- [Funcionalidades](#funcionalidades)
- [Exemplo de Uso](#exemplo-de-uso)
- [Arquitetura](#arquitetura)
- [Por que usar?](#por-que-usar)
- [Ajuda e Suporte](#ajuda-e-suporte)
- [Contribuições](#contribuições)
- [Manutenção](#manutenção)
- [Licença](#licença)

Aplicação CLI modular em Python para interação perfeita com múltiplos modelos de IA: OpenAI, Claude (Anthropic), Gemini (Google) e Groq. Construída com Design Driven by Domain (DDD), padrões de estratégia e fábricas extensíveis para troca fácil de modelos e recursos avançados como interpretadores e cache.

## Início Rápido

1. Clone o repositório:
   ```
   git clone https://github.com/alexribeirofaria/AI-Assistants.git
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

## Por que usar?
Este projeto é útil porque:
- Permite testar e usar múltiplos modelos de IA em um único CLI sem troca de ferramentas.
- Arquitetura DDD facilita extensões (novos modelos, features).
- Cache e threaded helpers melhoram performance.
- Fácil configuração e início rápido.

## Ajuda e Suporte
- Crie uma [issue](https://github.com/alexribeirofaria/AI-Assistants/issues) para bugs ou features.
- Consulte o código ou [discussões](https://github.com/alexribeirofaria/AI-Assistants/discussions).

Versão em inglês: [README.en.md](README.en.md)

## Contribuições
Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes. Código de Conduta: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Manutenção
Mantido por alexribeirofaria. Contribuições bem-vindas!

## Licença
Licença MIT - veja [LICENSE](license.md).
