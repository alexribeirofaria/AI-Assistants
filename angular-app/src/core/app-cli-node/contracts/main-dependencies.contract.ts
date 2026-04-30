import { IConsoleAppFactory } from './console-app-factory.contract';
import { IConsoleOutput } from './console-output.contract';
import { IInteractivePrompt } from './interactive-prompt.contract';
import { IRuntime } from './runtime.contract';

export interface MainDependencies {
  output?: IConsoleOutput;
  appFactory?: IConsoleAppFactory;
  prompt?: IInteractivePrompt;
  runtime?: IRuntime;
}
