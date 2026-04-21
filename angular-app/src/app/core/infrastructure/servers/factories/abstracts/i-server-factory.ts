import { IServer } from '../../abstracts/i-server';

export interface IServerFactory {
  buildServer(): IServer;

  requireEnv(key: string, errorMessage: string): string;

  optionalEnv(key: string, defaultValue: string): string;

  optionalIntEnv(key: string, defaultValue: number): number;

  optionalFloatEnv(key: string, defaultValue: number): number;
}
