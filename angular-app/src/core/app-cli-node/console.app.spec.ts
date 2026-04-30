import * as AppModule from '.';

describe('ConsoleApp Unit Tests', () => {
  it('exports the prompt runtime collaborators used by the bootstrap', () => {
    expect(AppModule.ConsoleCliService).toBeDefined();
    expect(AppModule.DefaultRuntimeService).toBeDefined();
  });
});
