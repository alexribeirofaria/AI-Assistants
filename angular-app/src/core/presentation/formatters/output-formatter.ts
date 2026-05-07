import { IOutputFormatter } from '../interfaces/i-output-formatter';

export class OutputFormatter implements IOutputFormatter {
  formatInputPrompt(providerName: string, modelName: string): string {
    return `[${providerName}(${modelName})] > `;
  }

  formatHelp(): string {
    return "Digite: Claude | OpenAI | Gemini | Groq | list models | cls -> limpar tela | exit\n";
  }

  formatWelcome(): string {
    return "Welcome to your AI Assistant";
  }

  formatModelSwitched(prompt: string): string {
    return `\nSwitched to ${prompt}`;
  }

  formatInterpretedInput(raw: string, interpreted: string): string {
    return `[info] Interpretei '${raw}' como '${interpreted}'.`;
  }

  formatResponse(domainName: string, response: string): string {
    return `\n[${domainName}]: ${response}\n`;
  }

  formatLoadingModels(): string {
    return "\n[info] Buscando modelos...\n";
  }

  formatElapsedTime(minutes: number, seconds: number): string {
    return `[info] Tempo decorrido: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  formatModelList(header: string, names: string[], prefix: string = '- '): string {
    const lines = [header];
    lines.push(...names.map(name => `${prefix}${name}`));
    return lines.join('\n');
  }

  formatWarning(message: string): string {
    return `\n[warn] ${message}\n`;
  }

  formatError(message: string): string {
    return `[ERROR] ${message}`;
  }

  formatGoodbye(): string {
    return "AI Assistant: Goodbye!";
  }
}
