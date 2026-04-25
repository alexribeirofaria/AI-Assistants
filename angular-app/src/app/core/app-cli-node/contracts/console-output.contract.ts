export interface IConsoleOutput {
  write(content: string): void;
  writeError(content: string): void;
}
