import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IAuth } from '../../models/IAuth';
import { TokenStorageService } from '../token/token.storage.service';

@Injectable({ providedIn: 'root' })

export abstract class AuthServiceBase {
  public accessTokenSubject = new BehaviorSubject<string | undefined>(undefined);
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  protected route = 'api/Acesso';

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService,
    private router: Router
  ) {
    const token = this.tokenStorage.getAccessToken();
    if (token) {
      this.accessTokenSubject.next(token);
      this.isAuthenticated$.next(true);
    } else {
      this.accessTokenSubject.next(undefined);
      this.isAuthenticated$.next(false);
    }
  }

  get accessToken$(): Observable<string | undefined> {
    return this.accessTokenSubject.asObservable();
  }

  login(auth: IAuth): void {
    this.tokenStorage.saveAccessToken(auth.accessToken);
    this.tokenStorage.saveRefreshToken(auth.refreshToken || '');
    this.accessTokenSubject.next(auth.accessToken);
    this.isAuthenticated$.next(true);
  }

  async autoLogin(): Promise<void> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return;
    }

    // AcessoService not available in this environment; default to logout.
    // Implement refresh logic when a backend client is available.
    this.logout();
  }

  logout(): void {
    this.accessTokenSubject.next(undefined);
    this.isAuthenticated$.next(false);
    this.tokenStorage.clear();
  }

  isAuthenticated(): boolean {
    const token = this.accessTokenSubject.getValue() ?? this.tokenStorage.getAccessToken();
    return !!token;
  }

}