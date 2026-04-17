import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { ChatStateService } from './state/chat.state.service';
import { IHomeModel } from '../../models';

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

  describe('getModels', () => {
    it('should fetch models without provider', fakeAsync(() => {
      const mockModels: IHomeModel[] = [{ id: '1', modelName: 'GPT-4', provider: 'openai' }];
      
      const promise = service.getModels();

      const req = httpMock.expectOne(req => req.url.includes('/models'));
      expect(req.request.method).toBe('GET');
      req.flush({ models: mockModels });
      tick();

      expectAsync(promise).toBeResolvedTo(mockModels);
    }));

    it('should fetch models with provider', fakeAsync(() => {
      const mockModels: IHomeModel[] = [{ id: '2', modelName: 'GPT-3.5', provider: 'openai' }];
      
      const promise = service.getModels('openai');

      const req = httpMock.expectOne(req => req.url.includes('/models?provider=openai'));
      expect(req.request.method).toBe('GET');
      req.flush({ models: mockModels });
      tick();

      expectAsync(promise).toBeResolvedTo(mockModels);
    }));
  });

  describe('changeProvider', () => {
    it('should post provider change', fakeAsync(() => {
      const promise = service.changeProvider('openai');

      const req = httpMock.expectOne(req => req.url.includes('/change-provider'));
      expect(req.request.method).toBe('POST');
      req.flush({ status: 'ok' });
      tick();

      expectAsync(promise).toBeResolvedTo({ status: 'ok' });
    }));
  });
});
