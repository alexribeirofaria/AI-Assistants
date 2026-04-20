import { IOutputStream } from './i_output_stream';

describe('IOutputStream', () => {
  it('should be instantiated', () => {
    const instance = new IOutputStream();
    expect(instance).toBeTruthy();
  });
});
