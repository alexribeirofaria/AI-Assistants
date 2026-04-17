import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ChatService } from '../../shared/services/chat/chat.service';
import { ChatStateService } from '../../shared/services/chat/state/chat.state.service';
import { HomePageComponent } from './home.page.component';
import { IHomeModel } from '../../shared/models';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let mockChatService: jasmine.SpyObj<ChatService>;
  let chatStateService: ChatStateService;

  const mockModels: IHomeModel[] = [
    { id: '1', modelName: 'GPT-4', provider: 'openai' },
    { id: '2', modelName: 'Claude-3', provider: 'anthropic' }
  ];

  beforeEach(async () => {
    mockChatService = jasmine.createSpyObj('ChatService', ['getModels', 'changeProvider', 'sendMessage']);
    mockChatService.getModels.and.returnValue(of({ models: [] }));
    mockChatService.changeProvider.and.returnValue(of({ status: 'ok' }));
    mockChatService.sendMessage.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [HomePageComponent],
      providers: [
        { provide: ChatService, useValue: mockChatService },
        ChatStateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    chatStateService = TestBed.inject(ChatStateService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load models on init', fakeAsync(() => {
      mockChatService.getModels.and.returnValue(of({ models: mockModels }));
      component.ngOnInit();
      tick();
      expect(mockChatService.getModels).toHaveBeenCalled();
    }));
  });

  describe('onProviderChange', () => {
    it('should call changeProvider and load models', fakeAsync(() => {
      mockChatService.getModels.and.returnValue(of({ models: mockModels }));
      component.onProviderChange('openai');
      tick();
      expect(chatStateService.selectedProvider()).toBe('openai');
      expect(mockChatService.changeProvider).toHaveBeenCalledWith('openai');
    }));

    it('should handle provider change error', fakeAsync(() => {
      mockChatService.changeProvider.and.returnValue(throwError(() => new Error('Error')));
      component.onProviderChange('openai');
      tick();
      expect(chatStateService.error()).toBeTruthy();
    }));
  });

  describe('onModelChange', () => {
    it('should set the selected model', () => {
      component.onModelChange('1');
      expect(chatStateService.selectedModel()).toBe('1');
    });
  });

  describe('onMessageSend', () => {
    it('should send message when not loading', fakeAsync(() => {
      component.onMessageSend('Hello');
      tick();
      expect(mockChatService.sendMessage).toHaveBeenCalledWith('Hello');
    }));

    it('should not send message when loading', () => {
      chatStateService.startStreaming();
      component.onMessageSend('Hello');
      expect(mockChatService.sendMessage).not.toHaveBeenCalled();
    });

    it('should clear error before sending', () => {
      chatStateService.setError('test error');
      component.onMessageSend('Hello');
      expect(chatStateService.error()).toBe('');
    });

    it('should handle sendMessage error', fakeAsync(() => {
      mockChatService.sendMessage.and.returnValue(throwError(() => new Error('Error')));
      component.onMessageSend('Hello');
      tick();
    }));
  });

  describe('loadModels', () => {
    it('should load models and set providers', fakeAsync(() => {
      mockChatService.getModels.and.returnValue(of({ models: mockModels }));
      component.ngOnInit();
      tick();
      expect(chatStateService.providers().length).toBe(2);
    }));

    it('should set first provider if none selected', fakeAsync(() => {
      mockChatService.getModels.and.returnValue(of({ models: mockModels }));
      component.ngOnInit();
      tick();
      expect(chatStateService.selectedProvider()).toBe('openai');
    }));

    it('should set first model if none selected', fakeAsync(() => {
      mockChatService.getModels.and.returnValue(of({ models: mockModels }));
      component.ngOnInit();
      tick();
      expect(chatStateService.selectedModel()).toBe('1');
    }));

    it('should handle load models error', fakeAsync(() => {
      mockChatService.getModels.and.returnValue(throwError(() => new Error('Error')));
      component.ngOnInit();
      tick();
      expect(chatStateService.error()).toBeTruthy();
    }));

    it('should load models with no error when empty', fakeAsync(() => {
      mockChatService.getModels.and.returnValue(of({ models: [] }));
      component.ngOnInit();
      tick();
      expect(chatStateService.error()).toBe('');
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe all subscriptions', fakeAsync(() => {
      component.ngOnInit();
      tick();
      expect(() => component.ngOnDestroy()).not.toThrow();
    }));
  });


  it('should have chatState properties', () => {
    expect(component.messages).toBeDefined();
    expect(component.isLoading).toBeDefined();
    expect(component.error).toBeDefined();
    expect(component.providers).toBeDefined();
    expect(component.selectedProvider).toBeDefined();
    expect(component.selectedModel).toBeDefined();
    expect(component.filteredModels).toBeDefined();
  });
});
