import { Component, Output, EventEmitter, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-chat-input",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./chat-input.component.html",
  styleUrl: "./chat-input.component.scss",
})
export class ChatInputComponent {
  @Input() disabled = false;
  @Output() messageSend = new EventEmitter<string>();
  inputText = "";

  onSend(): void {
    const text = this.inputText.trim();
    if (text && !this.disabled) {
      this.messageSend.emit(text);
      this.inputText = "";
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }
}
