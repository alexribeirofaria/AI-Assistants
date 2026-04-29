import { IServer } from '../../infrastructure/servers';
import { Gemini } from '../gemini-domain';

describe('Gemini Unit Tests', () => {
  let mockServer: jasmine.SpyObj<IServer>;
  let domain: Gemini;
  let createChatSpy: jasmine.Spy;
  let sendMessageSpy: jasmine.Spy;
  let listModelsSpy: jasmine.Spy;

  beforeEach(() => {
    mockServer = {
      chats: {
        create: (createChatSpy = jasmine.createSpy('create').and.returnValue({
          sendMessage: (sendMessageSpy = jasmine.createSpy('sendMessage').and.returnValue(
            Promise.resolve({ text: 'response text' })
          )),
        })),
      },
      models: {
        list: (listModelsSpy = jasmine.createSpy('list').and.returnValue({
          data: [{ id: 'gemini-1.5-flash', name: 'gemini-1.5-flash' }],
        })),
      },
    } as unknown as jasmine.SpyObj<IServer>;
    domain = new Gemini(mockServer, 'gemini');
  });

  it('should create instance', () => {
    expect(domain).toBeTruthy();
  });

  it('should have correct model and maxTokens', () => {
    expect(domain.model).toBe('gemini-2.0-flash');
    expect((domain as unknown as { maxTokens: number }).maxTokens).toBe(4096);
  });

  it('should buildResponseMessages', () => {
    const response = { text: 'response text' };
    expect(domain.buildResponseMessages(response)).toBe('response text');
  });

  it('should return empty text when response does not contain text', () => {
    expect(domain.buildResponseMessages({})).toBe('');
  });

  it('should sendMessage', async () => {
    const result = await domain.sendMessage('prompt');
    expect(createChatSpy).toHaveBeenCalledOnceWith({ model: 'gemini-2.0-flash' });
    expect(sendMessageSpy).toHaveBeenCalledOnceWith('prompt', { max_output_tokens: 4096 });
    expect(result).toBe('response text');
  });

  it('should list available models using the model name when present', async () => {
    await expectAsync(domain.listModels()).toBeResolvedTo(['gemini-1.5-flash']);
    expect(listModelsSpy).toHaveBeenCalled();
  });

  it('should fallback to model id when model name is missing', async () => {
    listModelsSpy.and.returnValue({
      data: [{ id: 'gemini-2.0', name: '' }],
    });

    await expectAsync(domain.listModels()).toBeResolvedTo(['gemini-2.0']);
  });

  it('should return an error marker when listing models throws', async () => {
    listModelsSpy.and.throwError('gemini list failed');
    const result = await domain.listModels();

    expect(result[0]).toContain('[error]');
    expect(result[0]).toContain('gemini list failed');
  });
});
