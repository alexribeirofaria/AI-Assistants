import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatUiErrorStateService {
  private readonly subject = new BehaviorSubject<string | null>(null);
  readonly error$ = this.subject.asObservable();

  show(message: string): void {
    this.subject.next(message);
  }

  clear(): void {
    this.subject.next(null);
  }
}
