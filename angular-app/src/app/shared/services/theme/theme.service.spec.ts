import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isDarkMode signal', () => {
    expect(service.isDarkMode).toBeTruthy();
  });

  it('should toggle theme', () => {
    const initialValue = service.isDarkMode();
    service.toggle();
    expect(service.isDarkMode()).toBe(!initialValue);
  });

  it('should toggle twice return to original', () => {
    const initialValue = service.isDarkMode();
    service.toggle();
    service.toggle();
    expect(service.isDarkMode()).toBe(initialValue);
  });
});
