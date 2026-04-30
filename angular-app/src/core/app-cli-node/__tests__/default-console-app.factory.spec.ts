import { AIAssistantApp } from '../../application';
import { DefaultConsoleAppFactory } from '../factories/default-console-app.factory';

describe('DefaultConsoleAppFactory', () => {
  it('creates an AIAssistantApp directly', () => {
    const app = new DefaultConsoleAppFactory().create();
    expect(app instanceof AIAssistantApp).toBeTrue();
  });
});
