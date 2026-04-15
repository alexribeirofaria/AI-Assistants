import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../../shared/services/chat/chat.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss'],
  standalone: false
})
export class HomePageComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private chatState = inject(ChatStateService);

  messages = this.chatState.messages;
  isLoading = this.chatState.isLoading;
  error = this.chatState.error;
  providers = this.chatState.providers;
  selectedProvider = this.chatState.selectedProvider;
  selectedModel = this.chatState.selectedModel;
  filteredModels = this.chatState.filteredModels;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadModels();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onProviderChange(provider: string): void {
    this.chatState.setProvider(provider);
    const sub = this.chatService.changeProvider(provider).subscribe({
      next: () => {
        this.loadModels(provider);
      },
      error: (err) => {
        console.error('Error changing provider:', err);
        this.chatState.setError('Erro ao trocar provider');
      }
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
      error: (err) => {
        console.error('Chat error:', err);
      }
    });
    this.subscriptions.push(sub);
  }

  private loadModels(provider?: string): void {
    const sub = this.chatService.getModels(provider).subscribe({
      next: (response) => {
        const models = response.models || [];
        this.chatState.setModels(models);

        if (models.length > 0) {
          const providers = [...new Set(models.map(m => m.provider))];
          this.chatState.setProviders(providers);

          if (!this.selectedProvider()) {
            this.chatState.setProvider(providers[0]);
          }

          const filtered = this.filteredModels();
          if (filtered.length > 0 && !this.selectedModel()) {
            this.chatState.setModel(filtered[0].id);
          }
        }
      },
      error: (err) => {
        console.error('Error loading models:', err);
        this.chatState.setError('Erro ao carregar modelos');
      }
    });
    this.subscriptions.push(sub);
  }
}
