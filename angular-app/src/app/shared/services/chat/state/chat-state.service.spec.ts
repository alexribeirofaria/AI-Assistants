import { TestBed } from '@angular/core/testing';
import { ChatStateService } from './chat-state.service';
import { IHomeModel, IMessage } from '../../../models';


describe('ChatStateService', () => {
  let service: ChatStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatStateService]
    });
    service = TestBed.inject(ChatStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty messages', () => {
      expect(service.messages()).toEqual([]);
    });

    it('should have isLoading false', () => {
      expect(service.isLoading()).toBe(false);
    });

    it('should have empty error', () => {
      expect(service.error()).toBe('');
    });

    it('should have empty selectedProvider', () => {
      expect(service.selectedProvider()).toBe('');
    });

    it('should have empty selectedModel', () => {
      expect(service.selectedModel()).toBe('');
    });

    it('should have empty models', () => {
      expect(service.models()).toEqual([]);
    });

    it('should have empty providers', () => {
      expect(service.providers()).toEqual([]);
    });

    it('should have empty filteredModels', () => {
      expect(service.filteredModels()).toEqual([]);
    });
  });

  describe('addUserMessage', () => {
    it('should add user message and return it', () => {
      const content = 'Hello';
      const msg = service.addUserMessage(content);

      expect(msg).toEqual({
        id: jasmine.any(String),
        role: 'user',
        content
      });
      expect(service.messages()).toContain(msg);
      expect(service.messages().length).toBe(1);
    });
  });

  describe('startStreaming', () => {
    it('should add streaming assistant message, set loading true and error empty', () => {
      const msg = service.startStreaming();

      expect(msg).toEqual({
        id: jasmine.any(String),
        role: 'assistant',
        content: '',
        streaming: true
      });
      expect(service.messages()).toContain(msg);
      expect(service.isLoading()).toBe(true);
      expect(service.error()).toBe('');
    });
  });

  describe('appendChunk', () => {
    it('should append chunk to last assistant message', () => {
      service.startStreaming();
      service.appendChunk('hello');

      const lastMsg = service.messages()[service.messages().length - 1];
      expect(lastMsg.content).toBe('hello');
      expect(lastMsg.role).toBe('assistant');
    });

    it('should not change if no assistant message', () => {
      service.addUserMessage('hi');
      const initialMessages = service.messages().slice();
      service.appendChunk('chunk');

      expect(service.messages()).toEqual(initialMessages);
    });
  });

  describe('stopStreaming', () => {
    it('should stop streaming on last assistant and set loading false', () => {
      service.startStreaming();
      service.stopStreaming();

      const lastMsg = service.messages()[service.messages().length - 1];
      expect(lastMsg.streaming).toBe(false);
      expect(service.isLoading()).toBe(false);
    });

    it('should not change if no assistant message', () => {
      service.addUserMessage('hi');
      const initialMessages = service.messages().slice();
      service.stopStreaming();

      expect(service.messages()).toEqual(initialMessages);
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error and loading false', () => {
      service.setError('Error msg');

      expect(service.error()).toBe('Error msg');
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('setProvider', () => {
    it('should set selected provider', () => {
      service.setProvider('openai');

      expect(service.selectedProvider()).toBe('openai');
    });
  });

  describe('setModel', () => {
    it('should set selected model', () => {
      service.setModel('gpt-4');

      expect(service.selectedModel()).toBe('gpt-4');
    });
  });

  describe('setModels', () => {
    it('should set models and derive unique providers', () => {
      const models: IHomeModel[] = [
        { id: '1', model: 'Model1', provider: 'openai' },
        { id: '2', model: 'Model2', provider: 'openai' },
        { id: '3', model: 'Model3', provider: 'groq' }
      ];
      service.setModels(models);

      expect(service.models()).toEqual(models);
      expect(service.providers()).toEqual(['openai', 'groq']);
    });

    it('should handle empty models', () => {
      service.setModels([]);

      expect(service.models()).toEqual([]);
      expect(service.providers()).toEqual([]);
    });
  });

  describe('setProviders', () => {
    it('should set providers', () => {
      const providers = ['openai', 'groq'];
      service.setProviders(providers);

      expect(service.providers()).toEqual(providers);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      service.setError('err');
      service.clearError();

      expect(service.error()).toBe('');
    });
  });

  describe('filteredModels (computed)', () => {
    it('should return all models if no provider selected', () => {
      const models: IHomeModel[] = [{ id: '1', model: 'Model1', provider: 'openai' }];
      service.setModels(models);

      expect(service.filteredModels()).toEqual(models);
    });

    it('should filter models by selected provider', () => {
      const models: IHomeModel[] = [
        { id: '1', model: 'Model1', provider: 'openai' },
        { id: '2', model: 'Model2', provider: 'groq' }
      ];
      service.setModels(models);
      service.setProvider('groq');

      expect(service.filteredModels()).toEqual([{ id: '2', model: 'Model2', provider: 'groq' }]);
    });

    it('should return empty if no matching provider', () => {
      const models: IHomeModel[] = [{ id: '1', model: 'Model1', provider: 'openai' }];
      service.setModels(models);
      service.setProvider('unknown');

      expect(service.filteredModels()).toEqual([]);
    });

    it('should react to provider change', () => {
      const models: IHomeModel[] = [
        { id: '1', model: 'Model1', provider: 'openai' },
        { id: '2', model: 'Model2', provider: 'groq' }
      ];
      service.setModels(models);
      service.setProvider('openai');
      expect(service.filteredModels()).toEqual([{ id: '1', model: 'Model1', provider: 'openai' }]);

      service.setProvider('groq');
      expect(service.filteredModels()).toEqual([{ id: '2', model: 'Model2', provider: 'groq' }]);
    });
  });

  describe('readonly signals immutability', () => {
    it('should not allow mutation of readonly signals', () => {
      expect(() => {
        (service.messages() as any).push({} as IMessage);
      }).toThrow();
    });
  });
});
