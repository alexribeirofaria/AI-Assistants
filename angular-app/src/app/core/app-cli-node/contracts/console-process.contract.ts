import { ProcessWriter } from "./process-writer.contract";

export interface ConsoleProcess {
  stdout?: ProcessWriter;
  stderr?: ProcessWriter;
}

export type ConsoleProcessHost = typeof globalThis & {
  process?: ConsoleProcess;
};
