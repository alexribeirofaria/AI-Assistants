import { ClaudeServer } from './claude_server';

describe('ClaudeServer', () => {
  it('should be instantiated', () => {
    const instance = new ClaudeServer();
    expect(instance).toBeTruthy();
  });
});
