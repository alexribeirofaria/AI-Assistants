import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChatMessageComponent } from './chat-message.component';
import { IMessage } from '../../../models';

describe('ChatMessageComponent', () => {
  let component: ChatMessageComponent;
  let fixture: ComponentFixture<ChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatMessageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isUser true for user role', () => {
    component.message = { id: '1', role: 'user', content: 'test' };
    expect(component.isUser).toBe(true);
  });

  it('should set isUser false for assistant role', () => {
    component.message = { id: '1', role: 'assistant', content: 'test' };
    expect(component.isUser).toBe(false);
  });

  it('should set isStreaming true when streaming is true', () => {
    component.message = { id: '1', role: 'user', content: 'test', streaming: true };
    expect(component.isStreaming).toBe(true);
  });

  it('should set isStreaming false when streaming is false', () => {
    component.message = { id: '1', role: 'user', content: 'test', streaming: false };
    expect(component.isStreaming).toBe(false);
  });

  it('should set isStreaming false when streaming is undefined', () => {
    component.message = { id: '1', role: 'user', content: 'test' };
    expect(component.isStreaming).toBe(false);
  });
});
