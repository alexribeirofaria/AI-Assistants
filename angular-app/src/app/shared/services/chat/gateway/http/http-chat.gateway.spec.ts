import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpChatGateway } from './http-chat.gateway';

describe('HttpChatGateway Unit Tests', () => {
  let gateway: HttpChatGateway;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpChatGateway],
    });

    gateway = TestBed.inject(HttpChatGateway);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch providers', async () => {
    const promise = gateway.getProviders();

    const req = httpMock.expectOne('http://localhost:5000/providers');
    expect(req.request.method).toBe('GET');
    req.flush({ providers: ['openai', 'groq'] });

    await expectAsync(promise).toBeResolvedTo(['openai', 'groq']);
  });

  it('should fetch models with encoded provider', async () => {
    const promise = gateway.getModels('open ai');

    const changeProviderReq = httpMock.expectOne('http://localhost:5000/change-provider');
    expect(changeProviderReq.request.method).toBe('POST');
    expect(changeProviderReq.request.body).toEqual({ provider: 'open ai' });
    changeProviderReq.flush({ status: 'ok' });

    const req = httpMock.expectOne('http://localhost:5000/models');
    expect(req.request.method).toBe('GET');
    req.flush({
      defaultModel: 'gpt-4o',
      models: [{ id: 'gpt-4o', modelName: 'GPT-4o', provider: 'openai' }],
    });

    await expectAsync(promise).toBeResolvedTo({
      defaultModel: 'gpt-4o',
      models: [{ id: 'gpt-4o', modelName: 'GPT-4o', provider: 'openai' }],
    });
  });

  it('should fetch models without provider and fallback to empty list', async () => {
    const promise = gateway.getModels();

    const changeProviderReq = httpMock.expectOne('http://localhost:5000/change-provider');
    expect(changeProviderReq.request.method).toBe('POST');
    expect(changeProviderReq.request.body).toEqual({ provider: undefined });
    changeProviderReq.flush({ status: 'ok' });

    const req = httpMock.expectOne('http://localhost:5000/models');
    expect(req.request.method).toBe('GET');
    req.flush({});

    await expectAsync(promise).toBeResolvedTo({ defaultModel: undefined, models: [] });
  });

  it('should return default model', async () => {
    const promise = gateway.getDefaultModel('openai');

    const req = httpMock.expectOne('http://localhost:5000/default-model');
    expect(req.request.method).toBe('GET');
    req.flush({ defaultModel: ['gpt-4o'] });

    await expectAsync(promise).toBeResolvedTo('gpt-4o');
  });

  it('should return provider-scoped default model', async () => {
    const promise = gateway.getDefaultModel('open ai');

    const req = httpMock.expectOne('http://localhost:5000/default-model');
    expect(req.request.method).toBe('GET');
    req.flush({ defaultModel: ['gpt-4o-mini'] });

    await expectAsync(promise).toBeResolvedTo('gpt-4o-mini');
  });

  it('should post provider change', async () => {
    const promise = gateway.changeProvider('openai');

    const req = httpMock.expectOne('http://localhost:5000/change-provider');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ provider: 'openai' });
    req.flush({ status: 'ok' });

    await expectAsync(promise).toBeResolvedTo({ status: 'ok' });
  });

  it('should post assistant message', async () => {
    const promise = gateway.sendMessage('hello');

    const req = httpMock.expectOne('http://localhost:5000/assistant');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ message: 'hello' });
    req.flush({ input: 'hello', response: { response: 'hi there' } });

    await expectAsync(promise).toBeResolvedTo({
      input: 'hello',
      response: { response: 'hi there' },
    });
  });
});
