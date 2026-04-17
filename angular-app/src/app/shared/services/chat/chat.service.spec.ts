import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { ChatStateService } from './state/chat.state.service';
import { IHomeModel } from '../../models';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;
  let chatState: ChatStateService;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = window.fetch;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService, ChatStateService]
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
    chatState = TestBed.inject(ChatStateService);
  });

  afterEach(() => {
    window.fetch = originalFetch;
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getModels', () => {
    it('should fetch models without provider', () => {
      const mockModels: IHomeModel[] = [{ id: '1', modelName: 'GPT-4', provider: 'openai' }];
      
      service.getModels().subscribe(response => {
        expect(response.models).toEqual(mockModels);
      });

      const req = httpMock.expectOne(req => req.url.includes('/models'));
      expect(req.request.method).toBe('GET');
      req.flush({ models: mockModels });
    });

    it('should fetch models with provider', () => {
      const mockModels: IHomeModel[] = [{ id: '2', modelName: 'GPT-3.5', provider: 'openai' }];
      
      service.getModels('openai').subscribe(response => {
        expect(response.models).toEqual(mockModels);
      });

      const req = httpMock.expectOne(req => req.url.includes('/models?provider=openai'));
      expect(req.request.method).toBe('GET');
      req.flush({ models: mockModels });
    });
  });

  describe('changeProvider', () => {
    it('should post provider change', () => {
      service.changeProvider('openai').subscribe(response => {
        expect(response.status).toBe('ok');
      });

      const req = httpMock.expectOne(req => req.url.includes('/change-provider'));
      expect(req.request.method).toBe('POST');
      req.flush({ status: 'ok' });
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      chatState.setModels([{ id: '1', modelName: 'GPT-4', provider: 'openai' }]);
    });

    it('should add user message and start streaming', fakeAsync(() => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        headersGet: (key: string) => key === 'content-type' ? 'application/json' : null,
        json: () => Promise.resolve({ response: 'Hello' }),
        text: () => Promise.resolve('Hello'),
        body: null
      };

      spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse as any));

      service.sendMessage('Hi').subscribe();
      tick();

      expect(chatState.messages().length).toBeGreaterThan(0);
    }));

    it('should handle HTTP error', fakeAsync(() => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Server Error',
        headers: new Map(),
        headersGet: () => null,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        body: null
      };
      
      spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse as any));

      service.sendMessage('Hi').subscribe({
        error: () => {}
      });
      tick();

      expect(chatState.error()).toBeTruthy();
    }));

    it('should handle text response without body', fakeAsync(() => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'text/plain']]),
        headersGet: (key: string) => key === 'content-type' ? 'text/plain' : null,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('Plain text response'),
        body: null
      };

      spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse as any));

      service.sendMessage('Hi').subscribe();
      tick();

      expect(chatState.messages().length).toBeGreaterThan(0);
    }));

    it('should handle JSON response with message field', fakeAsync(() => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        headersGet: (key: string) => key === 'content-type' ? 'application/json' : null,
        json: () => Promise.resolve({ message: 'Message from JSON' }),
        text: () => Promise.resolve(''),
        body: null
      };

      spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse as any));

      service.sendMessage('Hi').subscribe();
      tick();

      const messages = chatState.messages();
      expect(messages.length).toBeGreaterThan(0);
    }));

    it('should handle stream response with ReadableStream', fakeAsync(() => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('Hello '));
          controller.enqueue(encoder.encode('World'));
          controller.close();
        }
      });

      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'text/event-stream']]),
        headersGet: (key: string) => key === 'content-type' ? 'text/event-stream' : null,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        body: stream
      };

      spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse as any));

      service.sendMessage('Hi').subscribe();
      tick(100);

      const messages = chatState.messages();
      expect(messages.length).toBeGreaterThan(0);
    }));
  });
});
