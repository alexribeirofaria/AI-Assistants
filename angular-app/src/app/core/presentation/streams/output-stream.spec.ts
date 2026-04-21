import { OutputStream } from './output-stream';

const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation(jest.fn());

describe('OutputStream', () => {
  let stream: OutputStream;

  beforeEach(() => {
    spyConsoleLog.mockClear();
    stream = new OutputStream();
  });

  afterEach(() => {
    spyConsoleLog.mockRestore();
  });

  it('should create an instance', () => {
    expect(stream).toBeTruthy();
  });

  it('should write content', () => {
    stream.write('test content');
    expect(spyConsoleLog).toHaveBeenCalledWith('test content');
  });

  it('should end inline before write', () => {
    stream.writeInline('inline');
    stream.write('new');
    expect(spyConsoleLog).toHaveBeenCalledWith('');
    expect(spyConsoleLog).toHaveBeenCalledWith('new');
  });

  it('should write inline with carriage return', () => {
    stream.writeInline('test');
    expect(spyConsoleLog.mock.calls[0][0]).toMatch(/\\r/);
  });

  it('should pad inline', () => {
    stream.writeInline('short');
    stream.writeInline('long');
    expect(spyConsoleLog.mock.calls[1][0]).toBe('\\rshort ');
  });

  it('should clear inline with spaces', () => {
    stream.writeInline('test');
    stream.clearInline();
    expect(spyConsoleLog.mock.calls[1][0]).toMatch(/\\r    \\r/);
  });

  it('should ignore clear if no inline', () => {
    stream.clearInline();
    expect(spyConsoleLog).not.toHaveBeenCalled();
  });
});
