import { IOutputPresenter } from '../../interfaces/i-output-presenter';

class MockOutputPresenter implements IOutputPresenter {
  interpretedCalls: string[] = [];
  showCalls: string[] = [];

  getInputPrompt(providerName: string, modelName: string): string {
    return `[${providerName}(${modelName})] > `;
  }

  showUI(): void {}
  showModelSwitched(prompt: string): void { this.showCalls.push(prompt); }
  showInterpretedInput(userInput: string, expected: string): void { this.interpretedCalls.push(`${userInput} -> ${expected}`); }
  showResponse(domainName: string, response: string): void { this.showCalls.push(`${domainName}:${response}`); }
  showLoadingModels(): void {}
  showElapsedTime(minutes: number, seconds: number): void { this.showCalls.push(`${minutes}:${seconds}`); }
  clearElapsedTime(): void {}
  showModelList(header: string, names: string[], prefix?: string): void { this.showCalls.push(`${header}:${prefix ?? ''}${names.join(',')}`); }
  showWarning(content: string): void { this.showCalls.push(content); }
  showError(content: string): void { this.showCalls.push(content); }
  showGoodbye(): void {}
}

describe('IOutputPresenter', () => {
  it('should implement interface', () => {
    const presenter: IOutputPresenter = new MockOutputPresenter();
    expect(presenter).toBeTruthy();
  });
});
