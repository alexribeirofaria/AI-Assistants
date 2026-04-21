import { OutputStream } from '../streams/output-stream';

describe('OutputStream', () => {
  let stream: OutputStream;

  beforeEach(() => {
    stream = new OutputStream();
    spyOn(console, 'log');
  });

  it('writes content directly when no inline text is active', () => {
    stream.write('hello');
    expect(console.log).toHaveBeenCalledWith('hello');
  });

  it('writes inline content and clears inline state', () => {
    stream.writeInline('loading');
    expect(console.log).toHaveBeenCalledWith('\rloading');

    stream.clearInline();
    expect(console.log).toHaveBeenCalledWith('\r       \r');
  });

  it('flushes inline content before a normal write', () => {
    stream.writeInline('abc');
    stream.write('done');

    expect(console.log).toHaveBeenCalledWith('');
    expect(console.log).toHaveBeenCalledWith('done');
  });
});
