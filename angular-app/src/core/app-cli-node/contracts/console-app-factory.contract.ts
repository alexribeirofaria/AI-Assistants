import { IConsoleAssistantApp } from './console-app.contract';

export interface IConsoleAppFactory {
  create(): Promise<IConsoleAssistantApp> | IConsoleAssistantApp;
}
