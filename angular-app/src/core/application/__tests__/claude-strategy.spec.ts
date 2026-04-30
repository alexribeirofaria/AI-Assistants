import { ClaudeStrategy } from '../strategies/claude-strategy';

describe('ClaudeStrategy', () => {
  it('binds the Claude domain', () => {
    expect(new ClaudeStrategy().domainClass.name).toBe('Claude');
  });
});
