import { OutputFormatter } from '../../formatters/output-formatter';
import { IOutputFormatter } from '../../interfaces/i-output-formatter';

describe('IOutputFormatter', () => {
  it('should be instantiated', () => {
    const instance: IOutputFormatter = new OutputFormatter();
    expect(instance).toBeTruthy();
  });
});
