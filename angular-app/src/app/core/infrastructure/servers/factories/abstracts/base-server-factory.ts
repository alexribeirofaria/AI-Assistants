import { IServer } from '../../abstracts/i-server';

export abstract class BaseServerFactory {
  private static getEnv(name: string): string | undefined {
    return typeof globalThis !== 'undefined' && 'process' in globalThis
      ? (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name]
      : undefined;
  }

  protected requireEnv(name: string, msg: string): string {
    const value = BaseServerFactory.getEnv(name);
    if (!value) {
      throw new Error(msg);
    }
    return value;
  }

  protected optionalEnv(name: string, defaultValue: string): string {
    return BaseServerFactory.getEnv(name) || defaultValue;
  }

  protected optionalFloatEnv(name: string, defaultValue: number): number {
    const value = BaseServerFactory.getEnv(name);
    return value ? parseFloat(value) : defaultValue;
  }

  protected optionalIntEnv(name: string, defaultValue: number): number {
    const value = BaseServerFactory.getEnv(name);
    return value ? parseInt(value, 10) : defaultValue;
  }

  abstract buildServer(): IServer;
}
