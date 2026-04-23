import { IInteractivePrompt } from './interactive-prompt.contract';

export interface IReadlineFactory {
  create(): Promise<IInteractivePrompt> | IInteractivePrompt;
}
