import { IServer } from '../../infrastructure/servers';
import { LangChainDomain } from '../langchain-domain';

describe('LangChainDomain', () => {
  let mockServer: jasmine.SpyObj<IServer>;
  let domain: LangChainDomain;

  beforeEach(() => {
    mockServer = {
      invoke: jasmine.createSpy('invoke').and.returnValue(Promise.resolve({ text: 'response' })),
      models: {
        list: jasmine.createSpy('list').and.returnValue({ data: [{ id: 'gpt-3.5-turbo' }] }),
      },
    } as unknown as jasmine.SpyObj<IServer>;
    domain = new LangChainDomain(mockServer, 'langchain');
  });

  it('should create instance', () => {
    expect(domain).toBeTruthy();
  });

  it('should list models', () => {
    expect(domain.listModels()).toEqual(['gpt-3.5-turbo']);
  });

  it('should buildResponseMessages', () => {
    const response = { text: 'response' };
    expect(domain.buildResponseMessages(response)).toBe('response');
  });

  it('should sendMessage', async () => {
    const result = await domain.sendMessage('prompt');
    expect(result).toBeDefined();
  });
});
