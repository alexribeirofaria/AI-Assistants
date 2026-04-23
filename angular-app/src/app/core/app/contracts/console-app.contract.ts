export interface IConsoleAssistantApp {
  runConsoleApp(): void;
  processConsoleInput(input: string): Promise<boolean>;
}
