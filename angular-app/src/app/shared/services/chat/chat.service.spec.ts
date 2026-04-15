import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get models', () => {
    const mockModels = [{ id: 'gpt-4', name: 'GPT-4', provider: 'openai' }];
    service.getModels().subscribe(models => {
      expect(models).toEqual(mockModels);
    });

    const req = httpMock.expectOne('/api/models');
    expect(req.request.method).toBe('GET');
    req.flush(mockModels);
  });

  it('should change provider', () => {
    service.changeProvider('groq').subscribe();

    const req = httpMock.expectOne('/api/change-provider');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ provider: 'groq' });
    req.flush(null);
  });

  it('should send message and start streaming', () => {
    spyOn(service, 'sendMessageStream');

    service.sendMessage('test');

    expect(service.sendMessageStream).toHaveBeenCalledWith('test');
  });
});

