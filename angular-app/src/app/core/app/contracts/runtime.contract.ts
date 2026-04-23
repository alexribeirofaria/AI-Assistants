export interface IRuntime {
  readonly argv: string[];
  readonly isCliEnvironment: boolean;
  setExitCode(code: number): void;
}
