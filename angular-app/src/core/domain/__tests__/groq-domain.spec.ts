import { IServer } from '../../infrastructure/servers';
import { Groq } from '../groq-domain';

describe('Groq Unit Tests', () => {
  let mockServer: jasmine.SpyObj<IServer>;
  let domain: Groq;

  beforeEach(() => {
    mockServer = {
      chat: {
        completions: {
          create: jasmine.createSpy('create').and.resolveTo({
            choices: [{ message: { content: 'reply from groq' } }],
          }),
        },
      },
      models: {
        list: jasmine.createSpy('list').and.returnValue({
          data: [{ id: 'llama-3.1-8b-instant' }],
        }),
      },
    } as unknown as jasmine.SpyObj<IServer>;

    domain = new Groq(mockServer, 'groq');
  });

  it('creates an instance with the expected default model', () => {
    expect(domain.model).toBe('llama-3.1-8b-instant');
  });

  it('builds a text response from choices message content', () => {
    const response = { choices: [{ message: { content: 'value from choice' } }] };

    expect(domain.buildResponseMessages(response)).toBe('value from choice');
  });

  it('returns empty response marker when choices message content is not present', () => {
    expect(domain.buildResponseMessages({})).toBe('[EMPTY RESPONSE]');
  });

  it('falls back to text when choices message content is not present', () => {
    expect(domain.buildResponseMessages({ text: 'value from text' })).toBe('value from text');
  });

  it('falls back to array content when choices and text are not present', () => {
    expect(domain.buildResponseMessages({ content: [{ text: 'chunk-1' }, { content: 'chunk-2' }] })).toBe('chunk-1\nchunk-2');
  });

  it('sends a message using the server chat completions API', async () => {
    await expectAsync(domain.sendMessage('hello')).toBeResolvedTo('reply from groq');
    expect(mockServer.chat?.completions.create).toHaveBeenCalled();
  });

  it('returns client error when chat completions API is unavailable', async () => {
    const serverWithoutChat = {
      chat: undefined,
      models: mockServer.models,
    } as unknown as IServer;
    const domainWithoutChat = new Groq(serverWithoutChat, 'groq');

    await expectAsync(domainWithoutChat.sendMessage('hello')).toBeResolvedTo(
      '[CLIENT ERROR] API de chat não está disponível para o provider Groq'
    );
  });

  it('lists model ids from the server response', async () => {
    await expectAsync(domain.listModels()).toBeResolvedTo(['llama-3.1-8b-instant']);
    expect(mockServer.models.list).toHaveBeenCalled();
  });

  it('returns an error marker list when listing models fails', async () => {
    const failingServer = {
      chat: mockServer.chat,
      models: {
        list: jasmine.createSpy('list').and.throwError('broken list'),
      },
    } as unknown as IServer;
    const failingDomain = new Groq(failingServer, 'groq');

    const result = await failingDomain.listModels();

    expect(result[0]).toContain('[ERROR]');
    expect(result[0]).toContain('broken list');
  });
});
