import { Component, Input } from '@angular/core';
import { IMessage } from '../../../models';

@Component({
  selector: 'app-chat-message',
  standalone: false,
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  @Input() message!: IMessage;

  get isUser(): boolean {
    return this.message?.role === 'user';
  }

  get isStreaming(): boolean {
    return this.message?.streaming === true;
  }
}
