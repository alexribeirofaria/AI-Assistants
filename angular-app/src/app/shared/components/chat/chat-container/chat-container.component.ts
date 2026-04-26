import { Component, computed, inject, OnInit, signal } from "@angular/core";

import { ChatService } from "../../../services/chat/chat.service";
import { IHomeModel, IMessage } from "../../../models";

@Component({
  selector: "app-chat-container",
  templateUrl: "./chat-container.component.html",
  styleUrl: "./chat-container.component.scss",
  standalone: false,
})
  
export class ChatContainerComponent implements OnInit {
  private chatService = inject(ChatService);

  private readonly _providers = signal<string[]>([]);
  private readonly _selectedProvider = signal<string>('');
  private readonly _models = signal<IHomeModel[]>([]);
  private readonly _selectedModel = signal<string>('');
  private readonly _messages = signal<IMessage[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string>('');
  private readonly _gatewayStatus = signal<string>('');

  readonly providers = this._providers.asReadonly();
  readonly selectedProvider = this._selectedProvider.asReadonly();
  readonly models = computed(() => {
    const provider = this._selectedProvider();
    const models = this._models();
    if (!provider) {
      return models;
    }
    const selected = this.normalizeProvider(provider);
    return models.filter((model) => this.normalizeProvider(model.provider) === selected);
  });
  readonly selectedModel = this._selectedModel.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly gatewayStatus = this._gatewayStatus.asReadonly();
  
  ngOnInit(): void {
    this.loadProviders();
  }

  private async loadProviders(): Promise<void> {
    try {
      const providers = await this.chatService.getProviders();
      this._providers.set(providers);
      
      if (providers.length > 0) {
        const defaultProvider = providers[0];
        this._selectedProvider.set(defaultProvider);
        this._selectedModel.set('');
        await this.loadModels(defaultProvider);
      } else {
        await this.loadModels();
      }
    } catch {
      this._error.set("Erro ao carregar providers");
      await this.loadModels();
    }
  }

  private async loadModels(provider?: string): Promise<void> {
    try {
      const modelsData = await this.chatService.getModels(provider);
      this._models.set(modelsData.models);
      
      const defaultModel = modelsData.defaultModel ?? await this.chatService.getDefaultModel(provider);
      if (defaultModel) {
        this._selectedModel.set(defaultModel);
      }
    } catch {
      this._error.set("Erro ao carregar modelos");
    }
  }
  
  async onProviderChange(provider: string): Promise<void> {
    this._selectedProvider.set(provider);
    this._selectedModel.set('');
    try {
      await this.chatService.changeProvider(provider);
      await this.loadModels(provider);
    } catch {
      this._error.set("Erro ao trocar provider");
    }
  }
  
  onModelChange(modelId: string): void {
    this._selectedModel.set(modelId);
  }

  async onMessageSend(message: string): Promise<void> {
    if (this.isLoading()) return;

    const provider = this.selectedProvider() || undefined;

    this.addUserMessage(message);
    this.startAssistantStreaming(provider);

    try {
      const result = await this.chatService.sendMessage(message, {
        provider,
        model: this.selectedModel() || undefined,
      });

      this.finishAssistantStreaming(result.content, provider);
      this._gatewayStatus.set(result.gatewayStatus);
    } catch {
      this.stopAssistantStreaming();
      this._gatewayStatus.set('');
      this._error.set('Falha ao executar sendMessage');
    }
  }

  private addUserMessage(content: string): void {
    this._messages.update((messages) => [...messages, {
      id: Date.now().toString(),
      role: 'user',
      content,
    }]);
  }

  private startAssistantStreaming(provider?: string): void {
    this._messages.update((messages) => [...messages, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      streaming: true,
      provider,
    }]);
    this._isLoading.set(true);
    this._error.set('');
    this._gatewayStatus.set('');
  }

  private finishAssistantStreaming(content: string, provider?: string): void {
    this._messages.update((messages) => {
      const updated = [...messages];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant') {
        updated[updated.length - 1] = {
          ...last,
          content,
          streaming: false,
          provider,
        };
      }
      return updated;
    });
    this._isLoading.set(false);
  }

  private stopAssistantStreaming(): void {
    this._messages.update((messages) => {
      const updated = [...messages];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant') {
        updated[updated.length - 1] = { ...last, streaming: false };
      }
      return updated;
    });
    this._isLoading.set(false);
  }

  private normalizeProvider(provider: string | null | undefined): string {
    return (provider ?? '').trim().toLowerCase().replace(/\s+/g, '');
  }
}
