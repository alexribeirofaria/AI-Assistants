import { Repository } from '../repository/repository';

describe('Repository', () => {
  it('uses a registry by default', () => {
    expect(new Repository().registry).toBeTruthy();
  });
});
