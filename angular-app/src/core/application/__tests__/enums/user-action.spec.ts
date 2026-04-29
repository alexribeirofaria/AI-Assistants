import { UserAction } from '../../enums/user-action';

describe('UserAction', () => {
  it('should have enum values', () => {
    expect(UserAction.MESSAGE).toBe('message');
    expect(UserAction.LIST_MODELS).toBe('list_models');
  });
});
