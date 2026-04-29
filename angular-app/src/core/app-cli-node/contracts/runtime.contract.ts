export interface IRuntime {
  readonly isCliEnvironment: boolean;
  setExitCode(code: number): void;
}
