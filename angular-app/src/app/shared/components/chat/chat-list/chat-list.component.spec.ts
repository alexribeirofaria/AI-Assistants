import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListComponent } from './chat-list.component';

describe('ChatListComponent', () => {
  let component: ChatListComponent;
  let fixture: ComponentFixture<ChatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty messages by default', () => {
    expect(component.messages).toEqual([]);
  });

  it('should handle messages input', () => {
    component.messages = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there' }
    ];
    expect(component.messages.length).toBe(2);
  });

  it('should implement AfterViewChecked', () => {
    expect(component.ngAfterViewChecked).toBeDefined();
  });
});
