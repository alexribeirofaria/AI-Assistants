import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ChatInputComponent } from './chat-input.component';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatInputComponent, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have disabled false by default', () => {
    expect(component.disabled).toBe(false);
  });

  it('should have empty inputText', () => {
    expect(component.inputText).toBe('');
  });

  it('should send message when onSend is called with text', () => {
    spyOn(component.messageSend, 'emit');
    component.inputText = 'Hello world';
    component.onSend();
    expect(component.messageSend.emit).toHaveBeenCalledWith('Hello world');
  });

  it('should not send empty message', () => {
    spyOn(component.messageSend, 'emit');
    component.inputText = '   ';
    component.onSend();
    expect(component.messageSend.emit).not.toHaveBeenCalled();
  });

  it('should not send message when disabled', () => {
    spyOn(component.messageSend, 'emit');
    component.disabled = true;
    component.inputText = 'Hello';
    component.onSend();
    expect(component.messageSend.emit).not.toHaveBeenCalled();
  });

  it('should clear inputText after send', () => {
    component.inputText = 'Hello';
    component.onSend();
    expect(component.inputText).toBe('');
  });

  it('should handle Enter key to send', () => {
    spyOn(component, 'onSend');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeydown(event);
    expect(component.onSend).toHaveBeenCalled();
  });

  it('should not handle Enter key with shift', () => {
    spyOn(component, 'onSend');
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    component.onKeydown(event);
    expect(component.onSend).not.toHaveBeenCalled();
  });

  it('should handle other keys', () => {
    spyOn(component, 'onSend');
    const event = new KeyboardEvent('keydown', { key: 'a' });
    component.onKeydown(event);
    expect(component.onSend).not.toHaveBeenCalled();
  });
});
