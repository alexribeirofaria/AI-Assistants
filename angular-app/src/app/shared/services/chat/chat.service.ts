import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { ChatStateService } from './state/chat-state.service';
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

    return new Observable<void>(observer => {
      this.sendMessageStream(content)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  private async sendMessageStream(content: string): Promise<void> {
    try {
      const response = await fetch(this.baseUrl + '/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        const text = data.response || data.message || JSON.stringify(data);
        this.chatState.appendChunk(text);
        this.chatState.stopStreaming();
        return;
      }

      if (!response.body) {
        const text = await response.text();
        this.chatState.appendChunk(text);
        this.chatState.stopStreaming();
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          this.chatState.appendChunk(chunk);
        }
      }

      this.chatState.stopStreaming();
    } catch (err) {
      this.chatState.setError('Erro ao comunicar com o servidor');
      this.chatState.stopStreaming();
      throw err;
    }
  }
}
