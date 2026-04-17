import { Component, inject, OnInit } from "@angular/core";
import { ChatService } from "../../../services/chat/chat.service";
import { ChatStateService } from "../../../services/chat/state/chat.state.service";

@Component({
  selector: "app-chat-container",
  templateUrl: "./chat-container.component.html",
  styleUrl: "./chat-container.component.scss",
  standalone: false,
})
  
export class ChatContainerComponent implements OnInit {
  private chatService = inject(ChatService);
  private chatState = inject(ChatStateService);
  
  providers = this.chatState.providers;
  selectedProvider = this.chatState.selectedProvider;
  models = this.chatState.filteredModels;
  selectedModel = this.chatState.selectedModel;
  messages = this.chatState.messages;
  isLoading = this.chatState.isLoading;
  error = this.chatState.error;
  
  ngOnInit(): void {
    this.loadProviders();
  }

  private async loadProviders(): Promise<void> {
    try {
      const providers = await this.chatService.getProviders();
      this.chatState.setProviders(providers);
      
      if (providers.length > 0) {
        const defaultProvider = providers[0];
        this.chatState.setSelectedProvider(defaultProvider);
        await this.loadModels(defaultProvider);
      } else {
        await this.loadModels();
      }
    } catch {
      this.chatState.setError("Erro ao carregar providers");
      await this.loadModels();
    }
  }

  private async loadModels(provider?: string): Promise<void> {
    try {
      const modelsData = await this.chatService.getModels(provider);
      this.chatState.setModels(modelsData);
      
      const defaultModel = await this.chatService.getDefaultModel(provider);
      if (defaultModel) {
        this.chatState.setModel(defaultModel);
      }
    } catch {
      this.chatState.setError("Erro ao carregar modelos");
    }
  }
  
  async onProviderChange(provider: string): Promise<void> {
    this.chatState.setSelectedProvider(provider);
    try {
      await this.chatService.changeProvider(provider);
      await this.loadModels(provider);
    } catch {
      this.chatState.setError("Erro ao trocar provider");
    }
  }
  
  onModelChange(modelId: string): void {
    this.chatState.setModel(modelId);
  }

  async onMessageSend(message: string): Promise<void> {
    if (this.isLoading()) return;
    this.chatState.clearError();
    try {
      await this.chatService.sendMessage(message);
    } catch {
      this.chatState.setError("Erro ao enviar mensagem");
    }
  }
}
