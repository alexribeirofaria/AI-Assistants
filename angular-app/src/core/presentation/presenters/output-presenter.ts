import { OutputFormatter } from '../formatters/output-formatter';
import { IOutputPresenter } from '../interfaces/i-output-presenter';
import { OutputStream } from '../streams/output-stream';

export class OutputPresenter implements IOutputPresenter {
  private formatter: OutputFormatter;
  private stream: OutputStream;

  constructor(formatter = new OutputFormatter(), stream = new OutputStream()) {
    this.formatter = formatter;
    this.stream = stream;
  }

  getInputPrompt(providerName: string, modelName: string): string {
    return this.formatter.formatInputPrompt(providerName, modelName);
  }

  showUI(): void {
    this.stream.write(this.formatter.formatWelcome());
    this.stream.write(this.formatter.formatHelp());
  }

  showModelSwitched(prompt: string): void {
    this.stream.write(this.formatter.formatModelSwitched(prompt));
    this.stream.write(this.formatter.formatHelp());
  }

  showInterpretedInput(raw: string, interpreted: string): void {
    this.stream.write(this.formatter.formatInterpretedInput(raw, interpreted));
  }

  showResponse(domainName: string, response: string): void {
    this.stream.write(this.formatter.formatResponse(domainName, response));
  }

  showLoadingModels(): void {
    this.stream.write(this.formatter.formatLoadingModels());
  }

  showElapsedTime(minutes: number, seconds: number): void {
    this.stream.writeInline(this.formatter.formatElapsedTime(minutes, seconds));
  }

  clearElapsedTime(): void {
    this.stream.clearInline();
  }

  showModelList(header: string, names: string[], prefix = '- '): void {
    this.stream.write(this.formatter.formatModelList(header, names, prefix));
    this.stream.write('');
  }

  showWarning(message: string): void {
    this.stream.write(this.formatter.formatWarning(message));
  }

  showError(message: string): void {
    this.stream.write(this.formatter.formatError(message));
  }

  showGoodbye(): void {
    this.stream.write(this.formatter.formatGoodbye());
  }
}
