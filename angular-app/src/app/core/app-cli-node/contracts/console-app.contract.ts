export interface IConsoleAssistantApp {
  getInputPrompt(): string;
  runApp(): void;
  processInput(input: string): Promise<boolean>;
}
