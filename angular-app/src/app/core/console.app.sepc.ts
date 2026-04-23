import * as AppModule from './app/index';

describe('console.app bootstrap', () => {
  it('exports the prompt runtime collaborators used by the bootstrap', () => {
    expect(AppModule.ConsoleCliService).toBeDefined();
    expect(AppModule.DefaultRuntimeService).toBeDefined();
  });
});
