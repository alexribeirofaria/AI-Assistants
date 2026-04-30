import { IServer } from '../../infrastructure/servers';
import { Claude } from '../index';

describe('Claude Unit Tests', () => {
  let server: IServer;
  let domain: Claude;
  let createMessageSpy: jasmine.Spy;
  let listModelsSpy: jasmine.Spy;

  beforeEach(() => {
    server = {
      messages: {
        create: (createMessageSpy = jasmine.createSpy('create').and.returnValue(
          Promise.resolve({ content: [{ text: 'response' }] })
        )),
      },
      models: {
        list: (listModelsSpy = jasmine.createSpy('list').and.returnValue({
          data: [{ id: 'claude-3-5-haiku-20241022' }],
        })),
      },
    } as IServer;
    domain = new Claude(server, 'test');
  });

  it('should create', () => {
    expect(domain).toBeTruthy();
  });

  it('should have model', () => {
    expect(domain.model).toBe('claude-3-5-haiku-20241022');
  });

  it('should build response text from content chunks', () => {
    expect(domain.buildResponseMessages({ content: [{ text: 'a' }, { content: 'b' }] })).toBe(
      'a\nb'
    );
  });

  it('should fallback to scalar content when response content is not an array', () => {
    expect(domain.buildResponseMessages({ content: 'plain text' })).toBe('plain text');
  });

  it('should send messages using the configured model', async () => {
    await expectAsync(domain.sendMessage('hello')).toBeResolvedTo('response');
    expect(createMessageSpy).toHaveBeenCalledWith({
      model: 'claude-3-5-haiku-20241022',
      messages: [{ role: 'user', content: 'hello' }],
      max_tokens: 2048,
    });
  });

  it('should list available model ids', async () => {
    await expectAsync(domain.listModels()).toBeResolvedTo(['claude-3-5-haiku-20241022']);
    expect(listModelsSpy).toHaveBeenCalled();
  });

  it('should return error marker when listing models fails', async () => {
    const failingServer = {
      messages: server.messages,
      models: {
        list: jasmine.createSpy('list').and.throwError('list failed'),
      },
    } as unknown as IServer;
    const failingDomain = new Claude(failingServer, 'test');

    const result = await failingDomain.listModels();

    expect(result[0]).toContain('[ERROR]');
    expect(result[0]).toContain('list failed');
  });
});
