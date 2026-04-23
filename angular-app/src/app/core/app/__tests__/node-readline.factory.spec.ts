import { IModuleLoader } from '../contracts/module-loader.contract';
import { NodeReadlineFactory } from '../factories/node-readline.factory';

describe('NodeReadlineFactory', () => {
  it('creates a prompt interface with stdin and stdout from node process', async () => {
    const fakePrompt = { question: async () => '', close() {} };
    const createInterface = jasmine.createSpy('createInterface').and.returnValue(fakePrompt);
    const moduleLoader: IModuleLoader = {
      load: async (specifier: string) => {
        if (specifier === 'node:readline/promises') {
          return { createInterface } as never;
        }
        return { stdin: 'STDIN', stdout: 'STDOUT' } as never;
      },
    };

    const prompt = await new NodeReadlineFactory(moduleLoader).create();

    expect(prompt).toBe(fakePrompt as never);
    expect(createInterface).toHaveBeenCalledWith({
      input: 'STDIN',
      output: 'STDOUT',
    });
  });
});
