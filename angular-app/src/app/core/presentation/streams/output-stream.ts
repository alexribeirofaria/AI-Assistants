import { IOutputStream } from '../interfaces/i-output-stream';

export class OutputStream implements IOutputStream {
  private inlineActive = false;
  private lastInlineLength = 0;
  private readonly console = console;

  write(content: string): void {
    if (this.inlineActive) {
      this.console.log('');
      this.inlineActive = false;
      this.lastInlineLength = 0;
    }
    this.console.log(content);
  }

  writeInline(content: string): void {
    const padded = content.padEnd(this.lastInlineLength);
    this.console.log(`\r${padded}`);
    this.inlineActive = true;
    this.lastInlineLength = content.length;
  }

  clearInline(): void {
    if (!this.inlineActive) return;
    const spaces = ' '.repeat(this.lastInlineLength);
    this.console.log(`\r${spaces}\r`);
    this.inlineActive = false;
    this.lastInlineLength = 0;
  }
}
