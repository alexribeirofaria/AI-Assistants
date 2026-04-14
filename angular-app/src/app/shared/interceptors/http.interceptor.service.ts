import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, catchError, throwError, tap, finalize } from 'rxjs';
import { TokenStorageService } from '../services/token/token.storage.service';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private refreshInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private modalService: NgbModal,
    private tokenStorageService: TokenStorageService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.tokenStorageService.getAccessToken();

    if (token) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    const modalRef = this.modalService.open({});
    return next.handle(authReq).pipe(
      tap(() => {
        // successful response, nothing specific needed
      }),
      catchError((error: HttpErrorResponse) => {
        // Close loader on error
        modalRef.close();
        if (error.status === 401) {
          // No refresh token scenario handled by signOut
          this.tokenStorageService.signOut?.();
        }
        if (error.status === 404) {
          this.tokenStorageService.signOut?.();
        }
        return throwError(() => error);
      }),
      finalize(() => {
        // Ensure loader is closed on completion
        if (modalRef && modalRef.close) {
          modalRef.close();
        }
      })
    );
  }
}
