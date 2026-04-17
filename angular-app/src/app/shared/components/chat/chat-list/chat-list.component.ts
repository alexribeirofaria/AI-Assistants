import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IMessage } from "../../../models";
import { ChatMessageComponent } from "../chat-message/chat-message.component";
@Component({
  selector: "app-chat-list",
  standalone: true,
  imports: [CommonModule, FormsModule, ChatMessageComponent],
  templateUrl: "./chat-list.component.html",
  styleUrl: "./chat-list.component.scss",
})
  
export class ChatListComponent implements AfterViewChecked {
  @Input() messages: IMessage[] = [];
  @ViewChild("scrollContainer")
  private scrollContainer!: ElementRef<HTMLElement>;
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
