import { MessageStrategy } from '../decorator/helpers/strategies/message-strategy';

describe('MessageStrategy', () => {
  it('should be instantiated', () => {
    const instance = new MessageStrategy();
    expect(instance).toBeTruthy();
  });
});
