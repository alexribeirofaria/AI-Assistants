import { computed, Injectable, signal } from '@angular/core';
import { IMessage, IModelProvider } from '../../../responses';


@Injectable({
  providedIn: 'root'
})
export class ChatStateService {
  private _messages = signal<IMessage[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string>('');
  private _selectedProvider = signal<string>('');
  private _selectedModel = signal<string>('');
  private _models = signal<IModelProvider[]>([]);
  private _providers = signal<string[]>([]);
  private _gatewayStatus = signal<string>('');
  readonly gatewayStatus = this._gatewayStatus.asReadonly();

  setGatewayStatus(status: string): void {
    this._gatewayStatus.set(status);
  }

  clearGatewayStatus(): void {
    this._gatewayStatus.set('');
  }

  readonly messages = this._messages.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedProvider = this._selectedProvider.asReadonly();
  readonly selectedModel = this._selectedModel.asReadonly();
  readonly models = this._models.asReadonly();
  readonly providers = this._providers.asReadonly();

  readonly filteredModels = computed(() => {
    const provider = this._selectedProvider();
    if (!provider) return this._models();
    return this._models().filter(m => m.provider === provider);
  });

  addUserMessage(content: string): IMessage {
    const msg: IMessage = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    this._messages.update(msgs => [...msgs, msg]);
    return msg;
  }

  startStreaming(): IMessage {
    const msg: IMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      streaming: true
    };
    this._messages.update(msgs => [...msgs, msg]);
    this._isLoading.set(true);
    this._error.set('');
    return msg;
  }

  appendChunk(chunk: string): void {
    this._messages.update(msgs => {
      const updated = [...msgs];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant') {
        updated[updated.length - 1] = {
          ...last,
          content: last.content + chunk
        };
      }
      return updated;
    });
  }

  stopStreaming(): void {
    this._isLoading.set(false);
    this._messages.update(msgs => {
      const updated = [...msgs];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant') {
        updated[updated.length - 1] = { ...last, streaming: false };
      }
      return updated;
    });
  }

  setError(error: string): void {
    this._error.set(error);
    this._isLoading.set(false);
  }

  setProvider(provider: string): void {
    this._selectedProvider.set(provider);
  }

  setModel(model: string): void {
    this._selectedModel.set(model);
  }

  setModels(models: IModelProvider[]): void {
    this._models.set(models);
    const providers = [...new Set(models.map(m => m.provider))];
    this._providers.set(providers);
  }

  setProviders(providers: string[]): void {
    this._providers.set(providers);
  }

  clearError(): void {
    this._error.set('');
  }
}
