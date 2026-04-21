import { OutputFormatter } from './output-formatter';

describe('OutputFormatter', () => {
  let formatter: OutputFormatter;

  beforeEach(() => {
    formatter = new OutputFormatter();
  });

  it('should create an instance', () => {
    expect(formatter).toBeTruthy();
  });

  it('should format help correctly', () => {
    const result = formatter.formatHelp();
    expect(result).toContain('Digite: claude');
    expect(result).toContain('exit');
  });

  it('should format welcome correctly', () => {
    const result = formatter.formatWelcome();
    expect(result).toBe('Welcome to your AI Assistant');
  });

  it('should format model switched', () => {
    const result = formatter.formatModelSwitched('claude');
    expect(result).toBe('\nSwitched to claude');
  });

  it('should format interpreted input', () => {
    const result = formatter.formatInterpretedInput('claude', 'switch claude');
    expect(result).toBe(`[info] Interpretei 'claude' como 'switch claude'.`);
  });

  it('should format response', () => {
    const result = formatter.formatResponse('claude', 'Hello');
    expect(result).toBe('\n[claude]: Hello\n');
  });

  it('should format loading models', () => {
    const result = formatter.formatLoadingModels();
    expect(result).toBe('\n[info] Buscando modelos...\n');
  });

  it('should format elapsed time', () => {
    const result = formatter.formatElapsedTime(1, 23);
    expect(result).toBe('[info] Tempo decorrido: 01:23');
  });

  it('should format model list', () => {
    const names = ['gpt-4', 'claude-3'];
    const result = formatter.formatModelList('Models:', names);
    expect(result).toContain('- gpt-4');
    expect(result).toContain('- claude-3');
  });

  it('should format model list with custom prefix', () => {
    const names = ['gpt-4'];
    const result = formatter.formatModelList('Models:', names, '* ');
    expect(result).toContain('* gpt-4');
  });

  it('should format warning', () => {
    const result = formatter.formatWarning('Test warning');
    expect(result).toBe('\n[warn] Test warning\n');
  });

  it('should format error', () => {
    const result = formatter.formatError('Test error');
    expect(result).toBe('[ERROR] Test error');
  });

  it('should format goodbye', () => {
    const result = formatter.formatGoodbye();
    expect(result).toBe('AI Assistant: Goodbye!');
  });
});
