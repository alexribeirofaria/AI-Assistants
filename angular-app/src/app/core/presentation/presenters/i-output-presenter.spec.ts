import { IOutputPresenter } from './i-output-presenter';

describe('IOutputPresenter', () => {
  it('should have correct interface structure', () => {
    const presenter: IOutputPresenter = {
      showUI: jest.fn(),
      showModelSwitched: jest.fn(),
      showInterpretedInput: jest.fn(),
      showResponse: jest.fn(),
      showLoadingModels: jest.fn(),
      showElapsedTime: jest.fn(),
      clearElapsedTime: jest.fn(),
      showModelList: jest.fn(),
      showWarning: jest.fn(),
      showError: jest.fn(),
      showGoodbye: jest.fn(),
    };
    expect(presenter).toBeTruthy();
    expect(typeof presenter.showUI).toBe('function');
  });
});
