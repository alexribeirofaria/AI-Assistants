import { IServer } from '../../infrastructure/servers/abstracts/i-server';
import { BaseDomain } from '../abstracts/base-domain';

class FakeDomain extends BaseDomain {
  constructor() {
    super({ models: { list: async () => ({ data: [] }) } } as IServer, 'fake-model');
  }

  override buildResponseMessages(response: unknown): string {
    return `mapped:${String((response as { text?: string }).text ?? response)}`;
  }

  override async sendMessage(_prompt: string): Promise<string> {
    return '';
  }

  override async listModels(): Promise<string[]> {
    return [];
  }

  protected async _fetchDomainNames(): Promise<string[]> {
    return [];
  }

  async sendThrough(request: () => Promise<unknown>): Promise<string> {
    return this.send(request);
  }

  mapApiResponse(response: { completion_tokens: number; total_tokens: number }) {
    return this.responseTokens(response);
  }
}

describe('BaseDomain Unit Tests', () => {
  let domain: FakeDomain;

  beforeEach(() => {
    domain = new FakeDomain();
  });

  it('should keep the original model when useModel receives an empty value', () => {
    domain.useModel('   ');
    expect(domain.model).toBe('fake-model');
  });

  it('should update the model when useModel receives a valid value', () => {
    domain.useModel('custom-model');
    expect(domain.model).toBe('custom-model');
  });

  it('should return the class name as the domain name', () => {
    class DemoDomain {}
    expect(BaseDomain.getDomainName.call(DemoDomain)).toBe('DemoDomain');
  });

  it('should map successful send responses using buildResponseMessages', async () => {
    await expectAsync(domain.sendThrough(async () => ({ text: 'ok' }))).toBeResolvedTo('mapped:ok');
  });

  it('should return an empty response marker when send receives null', async () => {
    await expectAsync(domain.sendThrough(async () => null)).toBeResolvedTo('[EMPTY RESPONSE]');
  });

  it('should return a quota error marker when send catches a quota error', async () => {
    await expectAsync(domain.sendThrough(async () => {
      throw new Error('quota exceeded');
    })).toBeResolvedTo('[QUOTA ERROR] Limite de cota atingido');
  });

  it('should return an unknown error marker for non-quota failures', async () => {
    await expectAsync(domain.sendThrough(async () => {
      throw new Error('boom');
    })).toBeResolvedTo('[UNKNOWN ERROR] boom');
  });

  it('should map api response token fields', () => {
    expect(domain.mapApiResponse({ completion_tokens: 10, total_tokens: 20 })).toEqual({
      completion_tokens: 10,
      total_tokens: 20,
    });
  });
});
