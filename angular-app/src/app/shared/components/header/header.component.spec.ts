import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ThemeService } from '../../services/theme/theme.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let themeService: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [ThemeService]
    })
      .compileComponents();
    
    themeService = TestBed.inject(ThemeService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isDarkMode from theme service', () => {
    expect(component.isDarkMode).toBeTruthy();
  });

  it('should toggle theme on toggleTheme call', () => {
    const initialValue = themeService.isDarkMode();
    component.toggleTheme();
    expect(themeService.isDarkMode()).toBe(!initialValue);
  });
});
