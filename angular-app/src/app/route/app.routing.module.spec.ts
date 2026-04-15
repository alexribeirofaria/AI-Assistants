import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppRoutingModule } from './app.routing.module';
import { PageNotFoundComponent } from '../pages/not-found/not-found.page.component';
import { PrivacyComponent } from '../pages/privacy/privacy.page.component';
import { AuthGuard } from '../shared/services';

describe('AppRoutingModule (Lazy Load)', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRoutingModule],
      providers: [AuthGuard],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should configure LocationStrategy as PathLocationStrategy', () => {
    const locationStrategy = TestBed.inject(LocationStrategy);
    expect(locationStrategy instanceof PathLocationStrategy).toBeTrue();
  });

  // Removed: no lazy-loaded routes in AppRoutingModule



  it('should have correct direct component routes', () => {
    expect(router.config.find(r => r.path === 'privacy')?.component).toBe(PrivacyComponent);
    expect(router.config.find(r => r.path === 'register')?.redirectTo).toBe('/privacy');
    expect(router.config.find(r => r.path === 'register')?.pathMatch).toBe('full');
    expect(router.config.find(r => r.path === '**')?.component).toBe(PageNotFoundComponent);
  });

});
