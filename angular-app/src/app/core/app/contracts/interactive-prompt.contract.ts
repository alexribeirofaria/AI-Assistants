export interface IInteractivePrompt {
  question(prompt: string): Promise<string>;
  close(): void;
}
