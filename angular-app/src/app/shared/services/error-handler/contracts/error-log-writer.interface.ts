export interface ErrorLogWriter {
  write(destination: string, content: string): void;
}
