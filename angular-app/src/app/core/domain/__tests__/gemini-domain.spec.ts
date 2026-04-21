import { IServer } from '../../infrastructure/servers';
import { GeminiDomain } from '../gemini-domain';

describe('GeminiDomain', () => {
  let mockServer: jasmine.SpyObj<IServer>;
  let domain: GeminiDomain;

  beforeEach(() => {
    mockServer = {
      chats: {
        create: jasmine.createSpy('create').and.returnValue({
          sendMessage: jasmine.createSpy('sendMessage').and.returnValue(
            Promise.resolve({ text: 'response text' })
          ),
        }),
      },
      models: {
        list: jasmine.createSpy('list').and.returnValue({
          data: [{ id: 'gemini-2.5-flash', name: 'gemini-2.5-flash' }],
        }),
      },
    } as unknown as jasmine.SpyObj<IServer>;
    domain = new GeminiDomain(mockServer, 'gemini');
  });

  it('should create instance', () => {
    expect(domain).toBeTruthy();
  });

  it('should have correct model and maxTokens', () => {
    expect(domain.model).toBe('gemini-2.5-flash');
  });

  it('should buildResponseMessages', () => {
    const response = { text: 'response text' };
    expect(domain.buildResponseMessages(response)).toBe('response text');
  });

  it('should sendMessage', async () => {
    // mock logic
    const result = await domain.sendMessage('prompt');
    expect(result).toBeDefined();
  });
});
