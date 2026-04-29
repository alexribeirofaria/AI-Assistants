export interface RuntimeProcess {
  exitCode?: number;
}

export type RuntimeProcessHost = typeof globalThis & {
  process?: RuntimeProcess;
};
