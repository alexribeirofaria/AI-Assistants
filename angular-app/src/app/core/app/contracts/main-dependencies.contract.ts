import { IConsoleAppFactory } from './console-app-factory.contract';
import { IConsoleOutput } from './console-output.contract';
import { IReadlineFactory } from './prompt-factory.contract';
import { IRuntime } from './runtime.contract';

export interface MainDependencies {
  output?: IConsoleOutput;
  appFactory?: IConsoleAppFactory;
  promptFactory?: IReadlineFactory;
  runtime?: IRuntime;
}
