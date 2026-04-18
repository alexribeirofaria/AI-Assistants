import { TestBed } from '@angular/core/testing';

import { TokenStorageService } from './token.storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
    service.clear();
  });

  afterEach(() => {
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and get access token', () => {
    const token = 'test-access-token';
    service.saveAccessToken(token);
    expect(service.getAccessToken()).toBe(token);
  });

  it('should save and get refresh token', () => {
    const token = 'test-refresh-token';
    service.saveRefreshToken(token);
    expect(service.getRefreshToken()).toBe(token);
  });

  it('should return null for non-existent access token', () => {
    expect(service.getAccessToken()).toBeNull();
  });

  it('should return null for non-existent refresh token', () => {
    expect(service.getRefreshToken()).toBeNull();
  });

  it('should clear tokens', () => {
    service.saveAccessToken('access');
    service.saveRefreshToken('refresh');
    service.clear();
    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
  });

  it('should sign out', () => {
    service.saveAccessToken('access');
    service.signOut();
    expect(service.getAccessToken()).toBeNull();
  });
});
