import { BaseServerFactory } from '../servers/factories/abstracts/base-server-factory';
import { IServer } from '../servers/abstracts/i-server';
import { environment } from '../../../../environments/environment';

class TestFactory extends BaseServerFactory {
  buildServer(): IServer {
    return { models: { list: async () => ({ data: [] }) } } as IServer;
  }

  readRequired(name: string): string {
    return this.requireEnv(name, 'missing');
  }

  readOptional(name: string, defaultValue: string): string {
    return this.optionalEnv(name, defaultValue);
  }

  readOptionalFloat(name: string, defaultValue: number): number {
    return this.optionalFloatEnv(name, defaultValue);
  }

  readOptionalInt(name: string, defaultValue: number): number {
    return this.optionalIntEnv(name, defaultValue);
  }
}

describe('BaseServerFactory Unit Tests', () => {
  const env = environment as unknown as Record<string, unknown>;

  it('throws when a required value is missing', () => {
    const factory = new TestFactory();
    expect(() => factory.readRequired('UNKNOWN_ENV')).toThrowError('missing');
  });

  it('should build a server through createServer', () => {
    const factory = new TestFactory();
    expect(factory.createServer().models).toBeTruthy();
  });

  it('should return optional string defaults when the env is missing', () => {
    const factory = new TestFactory();
    expect(factory.readOptional('UNKNOWN_ENV', 'fallback')).toBe('fallback');
  });

  it('should read optional string values from the environment', () => {
    const factory = new TestFactory();
    env['TEST_STRING'] = 'configured';

    expect(factory.readOptional('TEST_STRING', 'fallback')).toBe('configured');
  });

  it('should read optional float values and fallback defaults', () => {
    const factory = new TestFactory();
    env['TEST_FLOAT'] = '2.5';

    expect(factory.readOptionalFloat('TEST_FLOAT', 1)).toBe(2.5);
    expect(factory.readOptionalFloat('UNKNOWN_FLOAT', 3.5)).toBe(3.5);
  });

  it('should throw for invalid optional float values', () => {
    const factory = new TestFactory();
    env['TEST_FLOAT_INVALID'] = 'abc';

    expect(() => factory.readOptionalFloat('TEST_FLOAT_INVALID', 1)).toThrowError(
      "Invalid float for env 'TEST_FLOAT_INVALID': abc"
    );
  });

  it('should read optional int values and fallback defaults', () => {
    const factory = new TestFactory();
    env['TEST_INT'] = '7';

    expect(factory.readOptionalInt('TEST_INT', 1)).toBe(7);
    expect(factory.readOptionalInt('UNKNOWN_INT', 9)).toBe(9);
  });

  it('should throw for invalid optional int values', () => {
    const factory = new TestFactory();
    env['TEST_INT_INVALID'] = 'abc';

    expect(() => factory.readOptionalInt('TEST_INT_INVALID', 1)).toThrowError(
      "Invalid int for env 'TEST_INT_INVALID': abc"
    );
  });
});
