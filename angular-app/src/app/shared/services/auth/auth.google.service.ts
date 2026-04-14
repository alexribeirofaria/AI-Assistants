import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../token/token.storage.service';
import { AuthServiceBase } from './auth.abstract.service';

declare const google: any;

@Injectable({
  providedIn: 'root'
})

export class AuthGoogleService extends AuthServiceBase {
  private clientId: string = '';
  private initialized = false;

  constructor(
    httpClient: HttpClient,
    tokenStorage: TokenStorageService,
    router: Router
  ) {
    super(httpClient, tokenStorage, router);
    this.initializeGoogleLogin();
  }

  private isGoogleScriptLoaded(): boolean {
    return typeof google !== 'undefined' && google.accounts && google.accounts.id;
  }

  private initializeGoogleLogin(): void {
    if (this.initialized) return;

    if (this.isGoogleScriptLoaded()) {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => {
          if (response.credential) {
            console.log('Google credential received:', response.credential); // Temporary
            this.accessTokenSubject.next(response.credential);
            this.isAuthenticated$.next(true);
          }
        }
      });

      this.initialized = true;
    } else {
      console.error('Atualize a página e tente novamente!');
    }
  }

  public handleGoogleLogin(): Observable<any> {
    console.log('Google login triggered');
    return new Observable((observer) => {
      if (!this.isGoogleScriptLoaded()) {
        observer.error(new Error("Google API não carregada."));
        return;
      }

      const callback = (response: any) => {
        if (!response.credential) {
          observer.error(new Error("Nenhuma credencial recebida."));
          return;
        }

        this.accessTokenSubject.next(response.credential);
        this.isAuthenticated$.next(true);
        observer.next(response);
        observer.complete();
      };

      google.accounts.id.initialize({
        client_id: this.clientId,
        callback,
      });

      const btn = document.querySelector(".g_signin") as HTMLElement;
      if (!btn) {
        observer.error(new Error("Elemento do botão não encontrado."));
        return;
      }

      google.accounts.id.renderButton(btn, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
      });
    });
  }
}
