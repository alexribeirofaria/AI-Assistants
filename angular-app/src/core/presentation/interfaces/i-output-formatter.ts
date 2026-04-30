export interface IOutputFormatter {
  formatInputPrompt(providerName: string, modelName: string): string;
  formatHelp(): string;
  formatWelcome(): string;
  formatModelSwitched(prompt: string): string;
  formatInterpretedInput(raw: string, interpreted: string): string;
  formatResponse(domainName: string, response: string): string;
  formatLoadingModels(): string;
  formatElapsedTime(minutes: number, seconds: number): string;
  formatModelList(header: string, names: string[], prefix?: string): string;
  formatWarning(message: string): string;
  formatError(message: string): string;
  formatGoodbye(): string;
}
