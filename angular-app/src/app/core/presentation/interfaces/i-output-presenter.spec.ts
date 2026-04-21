import { IOutputPresenter } from './i-output-presenter';


class MockOutputPresenter implements IOutputPresenter {
  interpretedCalls: string[] = [];
  showCalls: string[] = [];

  showInterpretedInput(userInput: string, expected: string): void {
    this.interpretedCalls.push(`${userInput} -> ${expected}`);
  }

  show(content: string): void {
    this.showCalls.push(content);
  }
}

describe('IOutputPresenter', () => {
  let presenter: IOutputPresenter;

  beforeEach(() => {
    presenter = new MockOutputPresenter();
  });

  it('should implement interface', () => {
    expect(presenter).toBeTruthy();
  });

  it('should call showInterpretedInput', () => {
    const mock = presenter as any as MockOutputPresenter;
    mock.showInterpretedInput('test', 'expected');
    expect(mock.interpretedCalls.length).toBe(1);
  });
});
