import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { ChatStateService } from './state/chat.state.service';
import { IHomeModel } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseService {

  constructor(
    http: HttpClient,
    private chatState: ChatStateService
  ) {
    super(http);
  }

  getModels(provider?: string): Observable<{ models: IHomeModel[] }> {
    const params = provider ? `?provider=${encodeURIComponent(provider)}` : '';
    return this.get<{ models: IHomeModel[] }>(`/models${params}`);
  }

  changeProvider(provider: string): Observable<{ status: string }> {
    return this.post<{ status: string }>('/change-provider', { provider });
  }

  sendMessage(content: string): Observable<void> {
    this.chatState.addUserMessage(content);
    this.chatState.startStreaming();

    // Usar HttpClient para manter compatibilidade com o proxy
    return new Observable<void>(observer => {
      this.post<{ input: string; response: { response?: string; message?: string } }>('/assistant', { message: content })
        .subscribe({
          next: (data) => {
            // Extrair texto da resposta
            let text = '';
            if (data.response) {
              text = data.response.response || data.response.message || JSON.stringify(data.response);
            }
            this.chatState.appendChunk(text);
            this.chatState.stopStreaming();
            observer.next();
            observer.complete();
          },
          error: (err) => {
            this.chatState.setError('Erro ao comunicar com o servidor');
            this.chatState.stopStreaming();
            observer.error(err);
          }
        });
    });
  }
}