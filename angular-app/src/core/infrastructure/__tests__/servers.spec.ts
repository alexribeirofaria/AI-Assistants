import { ClaudeServer } from '../servers/claude-server';
import { GeminiServer } from '../servers/gemini-server';
import { GroqServer } from '../servers/groq-server';
import { LangChainServer } from '../servers/langchain-server';
import { OpenAIServer } from '../servers/openai-server';
import { AnthropicServerFactory } from '../servers/factories/anthropic-server-factory';
import { GeminiServerFactory } from '../servers/factories/gemini-server-factory';
import { GroqServerFactory } from '../servers/factories/groq-server-factory';
import { LangChainServerFactory } from '../servers/factories/langchain-server-factory';
import { OpenAIServerFactory } from '../servers/factories/openai-server-factory';

describe('ConcreteServer Unit Tests', () => {
  it('creates an OpenAI factory', () => {
    const server = Object.create(OpenAIServer.prototype) as OpenAIServer;

    expect(server.createFactory()).toEqual(jasmine.any(OpenAIServerFactory));
  });

  it('creates a LangChain factory', () => {
    const server = Object.create(LangChainServer.prototype) as LangChainServer;

    expect(server.createFactory()).toEqual(jasmine.any(LangChainServerFactory));
  });

  it('creates a Groq factory', () => {
    const server = Object.create(GroqServer.prototype) as GroqServer;

    expect(server.createFactory()).toEqual(jasmine.any(GroqServerFactory));
  });

  it('creates a Gemini factory', () => {
    const server = Object.create(GeminiServer.prototype) as GeminiServer;

    expect(server.createFactory()).toEqual(jasmine.any(GeminiServerFactory));
  });

  it('creates an Anthropic factory', () => {
    const server = Object.create(ClaudeServer.prototype) as ClaudeServer;

    expect(server.createFactory()).toEqual(jasmine.any(AnthropicServerFactory));
  });
});
