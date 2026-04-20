import { InterfaceApplicationFactory } from './interface_application_factory';

describe('InterfaceApplicationFactory', () => {
  it('should be instantiated', () => {
    const instance = new InterfaceApplicationFactory();
    expect(instance).toBeTruthy();
  });
});
