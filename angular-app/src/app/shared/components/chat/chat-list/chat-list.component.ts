import { Component, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { IMessage } from '../../../models';

@Component({
  selector: 'app-chat-list',
  standalone: false,
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.scss',
})
export class ChatListComponent implements AfterViewChecked {
  @Input() messages: IMessage[] = [];
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLElement>;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
