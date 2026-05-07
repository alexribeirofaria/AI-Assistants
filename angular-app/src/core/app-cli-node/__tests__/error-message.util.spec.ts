import { toErrorMessage } from '../utils/error-message.util';

describe('toErrorMessage', () => {
  it('returns the message from Error instances', () => {
    expect(toErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('falls through when Error message is empty', () => {
    const err = new Error('   ');
    expect(toErrorMessage(err)).toBe('Error');
  });

  it('returns the string itself when the error is already a string', () => {
    expect(toErrorMessage('erro simples')).toBe('erro simples');
  });

  it('returns primitive values as strings', () => {
    expect(toErrorMessage(42)).toBe('42');
    expect(toErrorMessage(false)).toBe('false');
    expect(toErrorMessage(42n)).toBe('42');
  });

  it('extracts name and message from plain objects', () => {
    expect(toErrorMessage({ name: 'HttpError', message: 'bad request' })).toBe('HttpError: bad request');
    expect(toErrorMessage({ message: 'only message' })).toBe('only message');
  });

  it('returns name when message is missing and object cannot be stringified meaningfully', () => {
    expect(toErrorMessage({ name: 'OnlyName', toJSON: () => ({}) })).toBe('OnlyName');
  });

  it('returns safe JSON for serializable objects', () => {
    expect(toErrorMessage({ status: 500, reason: 'server' })).toContain('"status":500');
  });

  it('stringifies circular objects safely', () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    expect(toErrorMessage(circular)).toContain('[Circular]');
  });

  it('returns default message when JSON.stringify throws', () => {
    const problematic = {
      get value(): string {
        throw new Error('getter exploded');
      },
      toJSON(): unknown {
        return this.value;
      },
    };

    expect(toErrorMessage(problematic)).toBe('Erro desconhecido ao executar o prompt.');
  });

  it('falls back to a readable default when the object serializes to empty braces', () => {
    expect(toErrorMessage({})).toBe('Erro desconhecido ao executar o prompt.');
  });
});
