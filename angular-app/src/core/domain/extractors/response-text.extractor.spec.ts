import { ResponseTextExtractor } from './response-text.extractor';

describe('ResponseTextExtractor', () => {
  let extractor: ResponseTextExtractor;

  beforeEach(() => {
    extractor = new ResponseTextExtractor();
  });

  it('returns response.response when it is a string', () => {
    const result = extractor.extract({ input: 'hi', response: { response: 'ok' } } as never);

    expect(result).toBe('ok');
  });

  it('returns response.message when present', () => {
    const result = extractor.extract({ input: 'hi', response: { message: 'hello' } } as never);

    expect(result).toBe('hello');
  });

  it('formats model list payload', () => {
    const result = extractor.extract({
      input: 'models',
      response: {
        header: '=== Groq Models ===',
        names: ['llama-3.3-70b-versatile', 'qwen3-32b'],
        prefix: '- ',
      },
    } as never);

    expect(result).toBe('=== Groq Models ===\n- llama-3.3-70b-versatile\n- qwen3-32b');
  });

  it('formats nested model list payload', () => {
    const result = extractor.extract({
      input: 'models',
      response: {
        response: {
          header: '=== Groq Models ===',
          names: ['gpt-oss-120b', 'gpt-oss-20b'],
          prefix: '> ',
        },
      },
    } as never);

    expect(result).toBe('=== Groq Models ===\n> gpt-oss-120b\n> gpt-oss-20b');
  });

  it('stringifies unsupported object responses', () => {
    const result = extractor.extract({ input: 'hi', response: { foo: 'bar' } } as never);

    expect(result).toBe(JSON.stringify({ foo: 'bar' }));
  });
});
