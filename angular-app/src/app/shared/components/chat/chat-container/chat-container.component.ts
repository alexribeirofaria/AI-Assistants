import { Component, computed, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { Subscription } from 'rxjs';

import { IHomeModel, IMessage } from "../../../models";
import { ChatService } from "../../../services/chat/chat.service";
import {
  ChatUiErrorStateService,
  GlobalUiErrorStateService,
} from '../../../services/error-handler';

@Component({
  selector: "app-chat-container",
  templateUrl: "./chat-container.component.html",
  styleUrl: "./chat-container.component.scss",
  standalone: false,
})
  
export class ChatContainerComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private readonly chatUiErrorState = inject(ChatUiErrorStateService);
  private readonly globalUiErrorState = inject(GlobalUiErrorStateService);
  private readonly subscriptions = new Subscription();

  private readonly _providers = signal<string[]>([]);
  private readonly _selectedProvider = signal<string>('');
  private readonly _models = signal<IHomeModel[]>([]);
  private readonly _selectedModel = signal<string>('');
  private readonly _messages = signal<IMessage[]>([]);
  private readonly _isLoading = signal<boolean>(false);
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
  readonly gatewayStatus = this._gatewayStatus.asReadonly();
  
  ngOnInit(): void {
    this.bindUiErrors();
    this.loadProviders();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
      // Mensagem já é apresentada pelo fluxo global.
    }
  }
  
  async onProviderChange(provider: string): Promise<void> {
    this._selectedProvider.set(provider);
    this._selectedModel.set('');
    try {
      await this.chatService.changeProvider(provider);
      await this.loadModels(provider);
    } catch {
      // Mensagem já é apresentada pelo fluxo global.
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
    } catch (error) {
      void error;
      this.stopAssistantStreaming();
      this._gatewayStatus.set('');
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
      if (last && last.role === 'assistant' && last.streaming) {
        updated.pop();
      }
      return updated;
    });
    this._isLoading.set(false);
  }

  private bindUiErrors(): void {
    this.subscriptions.add(
      this.globalUiErrorState.error$.subscribe((message) => {
        if (!message) {
          return;
        }

        // Erros globais de infraestrutura não devem interromper a experiência do chat.
        // A UI permanece íntegra; os detalhes já foram registrados no fluxo de log.
        this.globalUiErrorState.clear();
      })
    );

    this.subscriptions.add(
      this.chatUiErrorState.error$.subscribe((message) => {
        if (!message) {
          return;
        }

        this.appendAssistantErrorMessage(message, this.selectedProvider() || undefined);
        this._isLoading.set(false);
        this._gatewayStatus.set('');
        this.chatUiErrorState.clear();
      })
    );
  }

  private appendAssistantErrorMessage(content: string, provider?: string): void {
    this._messages.update((messages) => {
      const updated = [...messages];
      const last = updated[updated.length - 1];

      if (last && last.role === 'assistant' && last.streaming) {
        updated.pop();
      }

      updated.push({
        id: `${Date.now()}-error`,
        role: 'assistant',
        content,
        provider,
        type: 'error',
      });

      return updated;
    });
    this._isLoading.set(false);
  }

  private normalizeProvider(provider: string | null | undefined): string {
    return (provider ?? '').trim().toLowerCase().replace(/\s+/g, '');
  }
}
