import { environment } from '../../../../../environments/environment';
import type { IServer } from '../../abstracts/i-server';

export abstract class BaseServerFactory {
  private static getEnv(name: string): string | undefined {
    return typeof globalThis !== 'undefined' && 'process' in globalThis
      ? (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name]
      : (environment as any)[name];
  }

  createServer(): IServer {
    return this.buildServer();
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
    if (!value) {
      return defaultValue;
    }

    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid float for env '${name}': ${value}`);
    }

    return parsed;
  }

  protected optionalIntEnv(name: string, defaultValue: number): number {
    const value = BaseServerFactory.getEnv(name);
    if (!value) {
      return defaultValue;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid int for env '${name}': ${value}`);
    }

    return parsed;
  }

  abstract buildServer(): IServer;
}
