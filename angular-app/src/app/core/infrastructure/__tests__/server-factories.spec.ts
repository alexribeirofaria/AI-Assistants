import { environment } from '../../../../environments/environment';
import { AnthropicServerFactory } from '../servers/factories/anthropic-server-factory';
import { GeminiServerFactory } from '../servers/factories/gemini-server-factory';
import { GroqServerFactory } from '../servers/factories/groq-server-factory';
import { LangChainServerFactory } from '../servers/factories/langchain-server-factory';
import { OpenAIServerFactory } from '../servers/factories/openai-server-factory';

describe('ServerFactories Unit Tests', () => {
  const env = environment as unknown as Record<string, unknown>;

  beforeEach(() => {
    env['LLM__OPEN_API_KEY'] = 'test-key';
    env['LLM__GROQ_API_KEY'] = 'test-key';
    env['LLM__GEMINI_API_KEY'] = 'test-key';
    env['LLM_CLAUDE_API_KEY'] = 'test-key';
  });

  it('builds an OpenAI server contract', () => {
    const server = new OpenAIServerFactory().buildServer();

    expect(server.chat?.completions?.create).toEqual(jasmine.any(Function));
    expect(server.models?.list).toEqual(jasmine.any(Function));
  });

  it('normalizes unsupported OpenAI roles to user', () => {
    const factory = new OpenAIServerFactory() as any;

    expect(factory.isSupportedRole('system')).toBeTrue();
    expect(factory.isSupportedRole('xpto')).toBeFalse();
    expect(factory.toChatMessage('xpto', 'hello')).toEqual({ role: 'user', content: 'hello' });
    expect(factory.toChatMessage('assistant', 'ok')).toEqual({ role: 'assistant', content: 'ok' });
  });

  it('builds a LangChain server contract', () => {
    const server = new LangChainServerFactory().buildServer();

    expect(server.invoke).toEqual(jasmine.any(Function));
    expect(server.models?.list).toEqual(jasmine.any(Function));
  });

  it('builds a Groq server contract', () => {
    const server = new GroqServerFactory().buildServer();

    expect(server.chat?.completions?.create).toEqual(jasmine.any(Function));
    expect(server.models?.list).toEqual(jasmine.any(Function));
  });

  it('normalizes unsupported Groq roles to user', () => {
    const factory = new GroqServerFactory() as any;

    expect(factory.isSupportedRole('developer')).toBeTrue();
    expect(factory.isSupportedRole('invalid')).toBeFalse();
    expect(factory.toChatMessage('invalid', 'hello')).toEqual({ role: 'user', content: 'hello' });
    expect(factory.toChatMessage('system', 'ok')).toEqual({ role: 'system', content: 'ok' });
  });

  it('builds a Gemini server contract', () => {
    const server = new GeminiServerFactory().buildServer();

    expect(server.chats?.create).toEqual(jasmine.any(Function));
    expect(server.models?.list).toEqual(jasmine.any(Function));
  });

  it('builds an Anthropic server contract', () => {
    const server = new AnthropicServerFactory().buildServer();

    expect(server.messages?.create).toEqual(jasmine.any(Function));
    expect(server.models?.list).toEqual(jasmine.any(Function));
  });

  it('returns static fallback models for LangChain list', async () => {
    const server = new LangChainServerFactory().buildServer();

    await expectAsync(server.models!.list()).toBeResolvedTo({
      data: [{ id: 'llama3-70b-8192' }, { id: 'mixtral-8x7b' }],
    });
  });

  it('throws explicit errors when required keys are missing', () => {
    env['LLM__OPEN_API_KEY'] = '';
    env['LLM__GROQ_API_KEY'] = '';
    env['LLM__GEMINI_API_KEY'] = '';
    env['LLM_CLAUDE_API_KEY'] = '';

    expect(() => new OpenAIServerFactory().buildServer()).toThrowError('OpenAI API key não encontrada no .env');
    expect(() => new LangChainServerFactory().buildServer()).toThrowError('LangChain API key não encontrada no .env');
    expect(() => new GroqServerFactory().buildServer()).toThrowError('Groq API key não encontrada no .env');
    expect(() => new GeminiServerFactory().buildServer()).toThrowError('Gemini API key não encontrada no .env');
    expect(() => new AnthropicServerFactory().buildServer()).toThrowError('Claude API key não encontrada no .env');
  });
});
