import { IOutputFormatter } from './i_output_formatter';

describe('IOutputFormatter', () => {
  it('should be instantiated', () => {
    const instance = new IOutputFormatter();
    expect(instance).toBeTruthy();
  });
});
