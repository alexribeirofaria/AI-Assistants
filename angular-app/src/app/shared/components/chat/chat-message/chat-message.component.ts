import { Component, Input } from "@angular/core";
import { IMessage } from "../../../../../core/application/responses";

@Component({
  selector: "app-chat-message",
  standalone: true,
  templateUrl: "./chat-message.component.html",
  styleUrl: "./chat-message.component.scss",
})

export class ChatMessageComponent {
  @Input() message!: IMessage;

  get isUser(): boolean {
    return this.message?.role === "user";
  }

  get isStreaming(): boolean {
    return this.message?.streaming === true;
  }

  get isError(): boolean {
    return this.message?.type === 'error';
  }

  get assistantLabel(): string {
    if (this.isError) {
      return 'Erro';
    }

    if (this.isUser) {
      return 'Você';
    }

    return this.message?.provider ? `Assistente · ${this.message.provider}` : 'Assistente';
  }
}
