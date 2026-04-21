import { OutputStream } from '../../streams/output-stream';
import { IOutputStream } from '../../interfaces/i-output-stream';

describe('IOutputStream', () => {
  it('should be instantiated', () => {
    const instance: IOutputStream = new OutputStream();
    expect(instance).toBeTruthy();
  });
});
