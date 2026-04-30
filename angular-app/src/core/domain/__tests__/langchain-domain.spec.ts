import { IServer } from '../../infrastructure/servers';
import { LangChain } from '../langchain-domain';

describe('LangChain', () => {
  let mockServer: jasmine.SpyObj<IServer>;
  let domain: LangChain;

  beforeEach(() => {
    mockServer = {
      invoke: jasmine.createSpy('invoke').and.returnValue(Promise.resolve({ text: 'response' })),
      models: {
        list: jasmine.createSpy('list').and.returnValue({ data: [{ id: 'gpt-3.5-turbo' }] }),
      },
    } as unknown as jasmine.SpyObj<IServer>;
    domain = new LangChain(mockServer, 'langchain');
  });

  it('should create instance', () => {
    expect(domain).toBeTruthy();
  });

  it('should list models', async () => {
    expect(await domain.listModels()).toContain('gpt-3.5-turbo');
  });

  it('should buildResponseMessages', () => {
    const response = { text: 'response' };
    expect(domain.buildResponseMessages(response)).toBe('response');
  });

  it('should fallback to choices content when text is not present', () => {
    const response = { choices: [{ message: { content: 'from-choice' } }] };
    expect(domain.buildResponseMessages(response)).toBe('from-choice');
  });

  it('should sendMessage', async () => {
    const result = await domain.sendMessage('prompt');
    expect(result).toBeDefined();
  });

  it('should return error marker when invoke is not implemented', async () => {
    const noInvokeDomain = new LangChain({ models: mockServer.models } as unknown as IServer, 'langchain');

    const result = await noInvokeDomain.sendMessage('prompt');
    expect(result).toContain('[UNKNOWN ERROR]');
  });

  it('should return error marker when list models fails', async () => {
    const failingDomain = new LangChain(mockServer, 'langchain');
    spyOn<any>(failingDomain as any, 'getDomainNamesCached').and.throwError('cache failed');

    const result = await failingDomain.listModels();
    expect(result[0]).toContain('[ERROR]');
  });
});
