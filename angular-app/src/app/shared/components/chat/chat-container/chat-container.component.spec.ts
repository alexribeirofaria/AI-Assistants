import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChatContainerComponent } from './chat-container.component';
import { ChatStateService } from '../../../services/chat/state/chat.state.service';

describe('ChatContainerComponent Test', () => {
  let component: ChatContainerComponent;
  let fixture: ComponentFixture<ChatContainerComponent>;
  let chatState: ChatStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatContainerComponent],
      providers: [ChatStateService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContainerComponent);
    component = fixture.componentInstance;
    chatState = TestBed.inject(ChatStateService);
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

  it('should handle onModelChange', () => {
    component.onModelChange('gpt4');
    expect(component.selectedModel()).toBe('gpt4');
  });

  it('should have selectedProvider signal', () => {
    expect(component.selectedProvider).toBeDefined();
    expect(typeof component.selectedProvider).toBe('function');
  });

  it('should have models and selectedModel signals', () => {
    expect(component.models).toBeDefined();
    expect(component.selectedModel).toBeDefined();
  });
});
