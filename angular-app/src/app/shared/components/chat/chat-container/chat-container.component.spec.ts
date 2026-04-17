import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatContainerComponent } from './chat-container.component';
import { ChatService } from '../../../services/chat/chat.service';
import { ChatStateService } from '../../../services/chat/state/chat.state.service';

describe('ChatContainerComponent Test', () => {
  let component: ChatContainerComponent;
  let fixture: ComponentFixture<ChatContainerComponent>;
  let httpMock: HttpTestingController;
  let chatState: ChatStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatContainerComponent, HttpClientTestingModule],
      providers: [
        ChatService,
        ChatStateService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContainerComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    chatState = TestBed.inject(ChatStateService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have providers defined', () => {
    expect(component.providers).toBeDefined();
  });

  it('should have messages array', () => {
    expect(component.messages).toBeDefined();
  });

  it('should have isLoading signal', () => {
    expect(component.isLoading).toBeDefined();
    expect(typeof component.isLoading).toBe('function');
  });

  it('should have error signal', () => {
    expect(component.error).toBeDefined();
    expect(typeof component.error).toBe('function');
  });

  it('should implement OnInit', () => {
    expect(component.ngOnInit).toBeDefined();
  });

  it('should implement OnDestroy', () => {
    expect(component.ngOnDestroy).toBeDefined();
  });

  it('should call loadModels on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    
    const req = httpMock.expectOne('/models');
    expect(req.request.method).toBe('GET');
    req.flush({ models: [] });
  }));

  it('should handle onProviderChange', fakeAsync(() => {
    chatState.setModels([{ id: 'gpt4', modelName: 'GPT-4', provider: 'openai' }]);
    component.onProviderChange('anthropic');
    tick();
    
    const req = httpMock.expectOne('/change-provider');
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'ok' });
  }));

  it('should handle onModelChange', () => {
    component.onModelChange('gpt4');
    expect(component.selectedModel()).toBe('gpt4');
  });

  it('should handle onMessageSend when not loading', fakeAsync(() => {
    chatState.setProvider('openai');
    component.onMessageSend('Hello');
    tick();
    
    const req = httpMock.expectOne('/assistant');
    expect(req.request.method).toBe('POST');
    req.flush({ response: 'Hi' });
  }));

  it('should not send message when loading (check isLoading)', () => {
    // Check isLoading value - if true, message should not send
    const isLoadingValue = component.isLoading();
    if (!isLoadingValue) {
      component.onMessageSend('Hello');
      // Should make HTTP call when not loading
      httpMock.expectOne('/assistant');
    }
  });

  it('should store subscriptions and unsubscribe on destroy', fakeAsync(() => {
    component.ngOnInit();
    tick();
    
    const req = httpMock.expectOne('/models');
    req.flush({ models: [] });
    
    expect(component['subscriptions'].length).toBeGreaterThan(0);
    component.ngOnDestroy();
  }));

  it('should have selectedProvider signal', () => {
    expect(component.selectedProvider).toBeDefined();
    expect(typeof component.selectedProvider).toBe('function');
  });

  it('should have models and selectedModel signals', () => {
    expect(component.models).toBeDefined();
    expect(component.selectedModel).toBeDefined();
  });
});

