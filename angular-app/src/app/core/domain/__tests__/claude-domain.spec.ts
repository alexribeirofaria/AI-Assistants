// Update spec to use index
import { IServer } from '../../infrastructure/servers';
import { ClaudeDomain } from '../index';

// Mock
describe('ClaudeDomain', () => {
  let server: IServer;
  let domain: ClaudeDomain;

  beforeEach(() => {
    server = {
      messages: {
        create: jasmine.createSpy('create').and.returnValue(
          Promise.resolve({ content: [{ text: 'response' }] })
        ),
      },
      models: {
        list: jasmine.createSpy('list').and.returnValue({ data: [{ id: 'claude-haiku-4-5-20251001' }] }),
      },
    } as IServer;
    domain = new ClaudeDomain(server, 'test');
  });

  it('should create', () => {
    expect(domain).toBeTruthy();
  });

  it('should have model', () => {
    expect(domain.model).toBe('claude-haiku-4-5-20251001');
  });
});
