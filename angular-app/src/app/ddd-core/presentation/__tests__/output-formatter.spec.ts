import { OutputFormatter } from '../formatters/output-formatter';

describe('OutputFormatter', () => {
  let formatter: OutputFormatter;

  beforeEach(() => {
    formatter = new OutputFormatter();
  });

  it('formats the welcome and help text', () => {
    expect(formatter.formatWelcome()).toContain('AI Assistant');
    expect(formatter.formatHelp()).toContain('list models');
  });

  it('formats model and response messages', () => {
    expect(formatter.formatModelSwitched('groq')).toContain('groq');
    expect(formatter.formatInterpretedInput('raw', 'parsed')).toContain('raw');
    expect(formatter.formatResponse('Groq', 'ok')).toContain('Groq');
  });

  it('formats loading, elapsed, warning, error and goodbye messages', () => {
    expect(formatter.formatLoadingModels()).toContain('Buscando');
    expect(formatter.formatElapsedTime(1, 2)).toContain('01:02');
    expect(formatter.formatWarning('warning')).toContain('warning');
    expect(formatter.formatError('error')).toContain('error');
    expect(formatter.formatGoodbye()).toContain('Goodbye');
  });

  it('formats model lists with custom prefix', () => {
    expect(formatter.formatModelList('header', ['one', 'two'], '> ')).toBe('header\n> one\n> two');
  });

  it('formats model lists with default prefix', () => {
    expect(formatter.formatModelList('header', ['one'])).toBe('header\n- one');
  });

  it('formats input prompt with provider and model', () => {
    expect(formatter.formatInputPrompt('Groq', 'llama-3.1-8b-instant')).toBe('[Groq(llama-3.1-8b-instant)] > ');
  });
});
