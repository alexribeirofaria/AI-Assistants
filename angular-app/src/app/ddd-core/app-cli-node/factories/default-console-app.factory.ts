import { AIAssistantApp } from '../../application';
import { IConsoleAppFactory } from '../contracts/console-app-factory.contract';
import { IConsoleAssistantApp } from '../contracts/console-app.contract';

export class DefaultConsoleAppFactory implements IConsoleAppFactory {
  create(): IConsoleAssistantApp {
    return new AIAssistantApp();
  }
}
