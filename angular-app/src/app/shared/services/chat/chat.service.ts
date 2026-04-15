import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AbstractService } from '../abstracts/abstract.service';
import { IMessage, IModel } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends AbstractService {
  private messagesSubject = new BehaviorSubject<IMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
  }

  getModels(): Observable<IModel[]> {
    return this.get<IModel[]>('/models');
  }

  changeProvider(provider: string): Observable<void> {
    return this.post<void>('/change-provider', { provider });
  }

  sendMessage(content: string): void {
    const userMsg: IMessage = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    this.messagesSubject.value.push(userMsg);
    this.messagesSubject.next([...this.messagesSubject.value]);
    this.loadingSubject.next(true);

    // Streaming with fetch or EventSource
    this.sendMessageStream(content);
  }

  private async sendMessageStream(content: string) {
    const assistantMsg: IMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      streaming: true
    };
    const currentMessages = [...this.messagesSubject.value, assistantMsg];
    this.messagesSubject.next(currentMessages);

    try {
      const response = await fetch(this.baseUrl + '/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content })
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, {stream: true});
        assistantMsg.content += chunk;
        this.updateLastMessage(assistantMsg);
      }

      assistantMsg.streaming = false;
      this.loadingSubject.next(false);
      this.updateLastMessage(assistantMsg);
    } catch (err) {
      console.error('Stream error', err);
      this.loadingSubject.next(false);
    }
  }

  private updateLastMessage(msg: IMessage) {
    const messages = [...this.messagesSubject.value];
    messages[messages.length - 1] = msg;
    this.messagesSubject.next(messages);
  }
}
