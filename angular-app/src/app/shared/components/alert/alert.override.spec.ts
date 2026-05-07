import { AlertService } from '../../services/alert/alert.service';
import { overrideBrowserAlert } from './alert.override';

describe('AlertOverride Unit Tests', () => {
  const originalAlert = window.alert;

  afterEach(() => {
    window.alert = originalAlert;
  });

  it('routes browser alerts to AlertService when available', () => {
    const alertService = {
      show: jasmine.createSpy('show'),
    } as unknown as AlertService;

    overrideBrowserAlert(alertService);
    window.alert(123);

    expect(alertService.show).toHaveBeenCalledOnceWith({
      message: '123',
      type: 'info',
    });
  });

  it('falls back to original alert when service is missing', () => {
    const originalSpy = jasmine.createSpy('originalAlert');
    window.alert = originalSpy as unknown as typeof window.alert;

    overrideBrowserAlert(null as unknown as AlertService);
    window.alert('hello');

    expect(originalSpy).toHaveBeenCalledOnceWith('hello');
  });
});
