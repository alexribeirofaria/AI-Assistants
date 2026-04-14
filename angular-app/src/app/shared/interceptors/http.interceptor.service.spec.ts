import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TokenStorageService, AuthService, CustomInterceptor } from '../services';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CustomInterceptor', () => {
  let interceptor: CustomInterceptor;
  let tokenService: jasmine.SpyObj<TokenStorageService>;
  let authService: jasmine.SpyObj<AuthService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let handler: jasmine.SpyObj<HttpHandler>;
  let modalCloseSpy: jasmine.Spy;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenStorageService', [
      'getAccessToken', 'getRefreshToken', 'updateAccessToken', 'saveRefreshToken', 'revokeRefreshToken', 'signOut', 'clear'
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', ['refreshToken']);
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open']);
    const handlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomInterceptor,
        { provide: TokenStorageService, useValue: tokenSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NgbModal, useValue: modalSpy },
        { provide: HttpHandler, useValue: handlerSpy }
      ]
    });

    interceptor = TestBed.inject(CustomInterceptor);
    tokenService = TestBed.inject(TokenStorageService) as jasmine.SpyObj<TokenStorageService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    handler = TestBed.inject(HttpHandler) as jasmine.SpyObj<HttpHandler>;
  });
  
  beforeEach(() => {
    modalCloseSpy = jasmine.createSpy('close');
    const modalRefMock: Partial<NgbModalRef> = { close: modalCloseSpy };
    (modalService.open as jasmine.Spy).and.returnValue(modalRefMock as NgbModalRef);
  });

  it('should show loader and hide loader after request completes', fakeAsync(() => {
    const request = new HttpRequest('GET', '/test');
    handler.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, handler).subscribe();
    flush();

    expect(handler.handle).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();
    expect(modalCloseSpy).toHaveBeenCalled();
  }));

  it('should clone request and add Authorization header', fakeAsync(() => {
    const request = new HttpRequest('GET', '/test');
    tokenService.getAccessToken.and.returnValue('abc123');
    handler.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(request, handler).subscribe();
    flush();

    const clonedReq = (handler.handle as jasmine.Spy).calls.mostRecent().args[0] as HttpRequest<any>;
    expect(clonedReq.headers.get('Authorization')).toBe('Bearer abc123');
  }));

  it('should handle 401 error and no refresh token', fakeAsync(() => {
    const request = new HttpRequest('GET', '/test');
    tokenService.getRefreshToken.and.returnValue(null);
    handler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: 401 })));

    let error: any;
    interceptor.intercept(request, handler).subscribe({ 
      error: e => error = e 
    });
    flush();

    expect(error.status).toBe(401);
    expect(tokenService.signOut).toHaveBeenCalled();
    expect(modalCloseSpy).toHaveBeenCalled();
  }));

  it('should handle 400 errors correctly', fakeAsync(() => {
    const request = new HttpRequest('GET', '/test');
    handler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: 400, error: 'Bad request' })));

    let error: any;
    interceptor.intercept(request, handler).subscribe({ 
      error: e => error = e 
    });
    flush();

    expect(error.error).toBe('Bad request');
    expect(modalCloseSpy).toHaveBeenCalled();
  }));

  it('should call signOut on 404 error', fakeAsync(() => {
    const request = new HttpRequest('GET', '/test');
    handler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

    let error: any;
    interceptor.intercept(request, handler).subscribe({ 
      error: e => error = e 
    });
    flush();

    expect(error.status).toBe(404);
    expect(tokenService.signOut).toHaveBeenCalled();
    expect(modalCloseSpy).toHaveBeenCalled();
  }));

  it('should handle 500 errors', fakeAsync(() => {
    const request = new HttpRequest('GET', '/test');
    handler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500, error: 'Internal' })));

    let error: any;
    interceptor.intercept(request, handler).subscribe({ 
      error: e => error = e 
    });
    flush();

    expect(error.error).toBe('Internal');
    expect(modalCloseSpy).toHaveBeenCalled();
  }));
});
