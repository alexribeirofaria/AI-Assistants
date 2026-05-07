import { IServer } from '../../infrastructure/servers';
import { OpenAI } from '../openai-domain';

describe('OpenAI', () => {
  let mockServer: jasmine.SpyObj<IServer>;
  let domain: OpenAI;

  beforeEach(() => {
    mockServer = {
      chat: {
        completions: {
          create: jasmine.createSpy('create'),
        },
      },
      models: {
        list: jasmine.createSpy('list'),
      },
    } as unknown as jasmine.SpyObj<IServer>;
    domain = new OpenAI(mockServer, 'openai');
  });

  it('should create instance', () => {
    expect(domain).toBeTruthy();
  });

  it('should have correct model', () => {
    expect(domain.model).toBe('gpt-3.5-turbo');
  });

  it('should buildResponseMessages', () => {
    const response = { choices: [{ message: { content: 'test content' } }] };
    expect(domain.buildResponseMessages(response)).toBe('test content');
  });

  it('should sendMessage', async () => {
    const mockResponse = { choices: [{ message: { content: 'response' } }], model: 'model' };
    mockServer.chat!.completions.create = jasmine
      .createSpy('create')
      .and.returnValue(Promise.resolve(mockResponse));
    const result = await domain.sendMessage('prompt');
    expect(result).toBeDefined();
  });

  it('should listModels', async () => {
    const mockModels = { data: [{ id: 'model1' }] };
    mockServer.models.list = jasmine.createSpy('list').and.returnValue(mockModels);
    const result = await domain.listModels();
    expect(result).toEqual(['model1']);
  });
});
