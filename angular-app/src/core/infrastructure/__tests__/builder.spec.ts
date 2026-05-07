import { OpenAI } from '../../domain/openai-domain';
import { BaseDomain } from '../../domain/abstracts/base-domain';
import { BaseServer } from '../servers/abstracts/base-server';
import { Builder } from '../repository/builder';

class FakeDomain extends BaseDomain {
  constructor(server: never, modelName: string) {
    super(server, modelName);
  }

  static override getDomainName(): string {
    return 'Fake';
  }

  override buildResponseMessages(): string {
    return '';
  }

  override async sendMessage(): Promise<string> {
    return '';
  }

  override async listModels(): Promise<string[]> {
    return [];
  }

  protected async _fetchDomainNames(): Promise<string[]> {
    return [];
  }
}

describe('Builder Unit Tests', () => {
  it('uses the injected server when provided', () => {
    const server = {} as BaseServer;
    const instance = new Builder(OpenAI, undefined, server);
    expect(instance.server).toBe(server);
  });

  it('should create the server lazily from the factory only once', () => {
    const server = { loadServer: jasmine.createSpy('loadServer').and.returnValue({}) } as unknown as BaseServer;
    const serverFactory = jasmine.createSpy('serverFactory').and.returnValue(server);
    const builder = new Builder(FakeDomain as never, serverFactory);

    expect(builder.server).toBe(server);
    expect(builder.server).toBe(server);
    expect(serverFactory).toHaveBeenCalledTimes(1);
  });

  it('should throw when neither factory nor instance is provided', () => {
    const builder = new Builder(FakeDomain as never);
    expect(() => builder.server).toThrowError(
      'Builder: serverFactory ou serverInstance deve ser fornecido'
    );
  });

  it('should build a domain using the loaded server and domain name', () => {
    const rawServer = { id: 'server' };
    const server = {
      loadServer: jasmine.createSpy('loadServer').and.returnValue(rawServer),
    } as unknown as BaseServer;
    const builder = new Builder(FakeDomain as never, undefined, server);

    const domain = builder.buildDomain() as FakeDomain;

    expect(server.loadServer).toHaveBeenCalled();
    expect(domain.model).toBe('Fake');
  });
});
