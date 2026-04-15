import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieConsentComponent } from './cookie-consent.component';

describe('CookieConsentComponent', () => {
  let component: CookieConsentComponent;
  let fixture: ComponentFixture<CookieConsentComponent>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [ CookieConsentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show banner when no consent exists on init', () => {
    localStorage.clear();
    const comp = new CookieConsentComponent();
    comp.ngOnInit();
    expect(comp.showBanner).toBe(true);
  });

  it('should not show banner when consent is accepted on init', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    const comp = new CookieConsentComponent();
    comp.ngOnInit();
    expect(comp.showBanner).toBe(false);
  });

  it('should not show banner when consent is declined on init', () => {
    localStorage.setItem('cookie-consent', 'declined');
    const comp = new CookieConsentComponent();
    comp.ngOnInit();
    expect(comp.showBanner).toBe(false);
  });

  it('should accept cookies and hide banner', () => {
    component.acceptCookies();
    expect(localStorage.getItem('cookie-consent')).toBe('accepted');
    expect(component.showBanner).toBe(false);
  });

  it('should decline cookies and hide banner', () => {
    component.declineCookies();
    expect(localStorage.getItem('cookie-consent')).toBe('declined');
    expect(component.showBanner).toBe(false);
  });
});
