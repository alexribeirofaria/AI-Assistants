export type ExecutionMode = 'prompt';

export interface ConsoleBootstrapOptions {
  readonly mode: ExecutionMode;
  readonly shouldExit: boolean;
}
