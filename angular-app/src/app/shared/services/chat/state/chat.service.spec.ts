import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { ChatStateService } from './state/chat-state.service';
import { IModel } from '../../models';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;
  let chatState: ChatStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService, ChatStateService]
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
    chatState = TestBed.inject(ChatStateService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get models', () => {
    const mockResponse = { models: [{ id: 'gpt-4', name: 'GPT-4', provider: 'openai' }] };
    service.getModels().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/models');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should change provider', () => {
    service.changeProvider('groq').subscribe();

    const req = httpMock.expectOne('/api/change-provider');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ provider: 'groq' });
    req.flush({ status: 'ok' });
  });
});
