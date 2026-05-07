import { UserAction } from '../enums/user-action';
import { MessageStrategy } from '../decorator/helpers/strategies/message-strategy';

describe('MessageStrategy Unit Tests', () => {
  let instance: MessageStrategy;

  beforeEach(() => {
    instance = new MessageStrategy();
  });

  it('always handles any input as message', () => {
    expect(instance.canHandle('anything', ['anything'])).toBeTrue();
    expect(instance.canHandle('', [])).toBeTrue();
  });

  it('returns message action with tokens joined as payload', () => {
    expect(instance.handle('ignored', ['hello', 'world'])).toEqual([UserAction.MESSAGE, 'hello world']);
    expect(instance.handle('ignored', [])).toEqual([UserAction.MESSAGE, '']);
  });
});
