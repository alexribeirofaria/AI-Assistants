import { ClaudeServer } from '../servers/claude-server';
import { AnthropicServerFactory } from '../servers/factories/anthropic-server-factory';
import { GeminiServerFactory } from '../servers/factories/gemini-server-factory';
import { GroqServerFactory } from '../servers/factories/groq-server-factory';
import { OpenAIServerFactory } from '../servers/factories/openai-server-factory';
import { GeminiServer } from '../servers/gemini-server';
import { GroqServer } from '../servers/groq-server';
import { OpenAIServer } from '../servers/openai-server';

describe('ConcreteServer Unit Tests', () => {
  it('creates an OpenAI factory', () => {
    const server = Object.create(OpenAIServer.prototype) as OpenAIServer;

    expect(server.createFactory()).toEqual(jasmine.any(OpenAIServerFactory));
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
