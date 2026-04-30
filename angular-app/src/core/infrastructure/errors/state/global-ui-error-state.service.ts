import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalUiErrorStateService {
  private readonly _error$ = new BehaviorSubject<string | null>(null);
  readonly error$ = this._error$.asObservable();

  show(message: string): void {
    this._error$.next(message);
  }

  clear(): void {
    this._error$.next(null);
  }
}
