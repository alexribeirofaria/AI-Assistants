import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TokenStorageService } from '../token/token.storage.service';
import { AuthServiceBase } from './auth.abstract.service';

describe('AuthServiceBase Unit Test', () => {
  let service: AuthServiceBase;
  let tokenStorage: jasmine.SpyObj<TokenStorageService>;
  let router: jasmine.SpyObj<Router>;

  class AuthServiceTest extends AuthServiceBase {
    constructor() {
      super(
        null! as any,
        tokenStorage!,
        router!
      );
    }
  }

  beforeEach(() => {
    tokenStorage = jasmine.createSpyObj('TokenStorageService', [
      'getAccessToken', 'getRefreshToken', 'saveAccessToken', 'saveRefreshToken', 'clear'
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthServiceBase, useClass: AuthServiceTest },
        { provide: TokenStorageService, useValue: tokenStorage },
        { provide: Router, useValue: router }
      ]
    });

    service = TestBed.inject(AuthServiceBase);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if user is authenticated', () => {
    tokenStorage.getAccessToken.and.returnValue('token');

    const result = service.isAuthenticated();

    expect(result).toBeTrue();
  });

  it('should return false if not authenticated', () => {
    tokenStorage.getAccessToken.and.returnValue(null);
    (service as any)['accessTokenSubject'].next(undefined);

    const result = service.isAuthenticated();

    expect(result).toBeFalse();
  });

  it('should logout correctly', () => {
    (service as any)['accessTokenSubject'].next('token');
    (service as any)['isAuthenticated$'].next(true);

    service.logout();

    expect((service as any)['accessTokenSubject'].getValue()).toBeUndefined();
    expect(tokenStorage.clear).toHaveBeenCalled();
  });

  it('should login and save tokens', () => {
    const auth = { accessToken: 'a', refreshToken: 'b', authenticated: true, created: '', expiration: '' };

    service.login(auth);

    expect(tokenStorage.saveAccessToken).toHaveBeenCalledWith('a');
    expect(tokenStorage.saveRefreshToken).toHaveBeenCalledWith('b');
  });

  it('should logout if no refresh token during autoLogin', fakeAsync(async () => {
    tokenStorage.getRefreshToken.and.returnValue(null);
    const logoutSpy = spyOn(service, 'logout');

    await service.autoLogin();
    flush();

    expect(logoutSpy).toHaveBeenCalled();
  }));
});
