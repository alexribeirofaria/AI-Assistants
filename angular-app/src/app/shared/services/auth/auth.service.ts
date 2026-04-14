import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { TokenStorageService } from "../token/token.storage.service";
import { AuthServiceBase } from "./auth.abstract.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends AuthServiceBase {

  constructor(
    httpClient: HttpClient,
    tokenStorage: TokenStorageService,
    router: Router
  ) {
    super(httpClient, tokenStorage, router);
    const token = this.tokenStorage.getAccessToken();
    if (token) {
      this.isAuthenticated$.next(true);
    }
  }

}
