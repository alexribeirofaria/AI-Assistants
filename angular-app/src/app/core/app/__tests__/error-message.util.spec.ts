import { toErrorMessage } from '../utils/error-message.util';

describe('toErrorMessage', () => {
  it('returns the message from Error instances', () => {
    expect(toErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('returns the string itself when the error is already a string', () => {
    expect(toErrorMessage('erro simples')).toBe('erro simples');
  });

  it('stringifies circular objects safely', () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    expect(toErrorMessage(circular)).toContain('[Circular]');
  });

  it('falls back to a readable default when the object serializes to empty braces', () => {
    expect(toErrorMessage({})).toBe('Erro desconhecido ao executar o prompt.');
  });
});
