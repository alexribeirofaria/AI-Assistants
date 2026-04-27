export interface IOutputPresenter {
  getInputPrompt(providerName: string, modelName: string): string;
  showUI(): void;
  showModelSwitched(prompt: string): void;
  showInterpretedInput(raw: string, interpreted: string): void;
  showResponse(domainName: string, response: string): void;
  showLoadingModels(): void;
  showElapsedTime(minutes: number, seconds: number): void;
  clearElapsedTime(): void;
  showModelList(header: string, names: string[], prefix?: string): void;
  showWarning(message: string): void;
  showError(message: string): void;
  showGoodbye(): void;
}
