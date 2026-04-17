import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ChatService } from "../../../services/chat/chat.service";
import { ChatStateService } from "../../../services/chat/state/chat.state.service";

@Component({
  selector: "app-chat-container",
  templateUrl: "./chat-container.component.html",
  styleUrl: "./chat-container.component.scss",
  standalone: false,
})
  
export class ChatContainerComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private chatState = inject(ChatStateService);
  providers = this.chatState.providers;
  selectedProvider = this.chatState.selectedProvider;
  models = this.chatState.filteredModels;
  selectedModel = this.chatState.selectedModel;
  messages = this.chatState.messages;
  isLoading = this.chatState.isLoading;
  error = this.chatState.error;
  private subscriptions: Subscription[] = [];
  
  ngOnInit(): void {
    this.loadModels();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  
  private loadModels(): void {
    const sub = this.chatService.getModels().subscribe({
      next: (response) => {
        this.chatState.setModels(response.models || []);
      },
      error: () => {
        this.chatState.setError("Erro ao carregar modelos");
      },
    });
    this.subscriptions.push(sub);
  }
  
  onProviderChange(provider: string): void {
    this.chatState.setProvider(provider);
    this.chatState.setModel("");
    const sub = this.chatService.changeProvider(provider).subscribe({
      next: () => {
        this.loadModels();
      },
      error: () => {
        this.chatState.setError("Erro ao trocar provider");
      },
    });
    this.subscriptions.push(sub);
  }
  
  onModelChange(modelId: string): void {
    this.chatState.setModel(modelId);
  }
  
  onMessageSend(message: string): void {
    if (this.isLoading()) return;
    this.chatState.clearError();
    const sub = this.chatService.sendMessage(message).subscribe({
      error: () => {
        this.chatState.setError("Erro ao enviar mensagem");
      },
    });
    this.subscriptions.push(sub);
  }
}
