export interface IOutputStream {
  write(content: string): void;
  writeInline(content: string): void;
  clearInline(): void;
}
