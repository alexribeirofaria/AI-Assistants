import { IOutputPresenterFactory } from '../../interfaces/i-output-presenter-factory';
import { IOutputPresenter } from '../../interfaces/i-output-presenter';

describe('IOutputPresenterFactory', () => {
  it('should describe a presenter factory contract', () => {
    const instance: IOutputPresenterFactory = {
      createPresenter: () => jasmine.createSpyObj<IOutputPresenter>('IOutputPresenter', [
        'showUI',
        'showModelSwitched',
        'showInterpretedInput',
        'showResponse',
        'showLoadingModels',
        'showElapsedTime',
        'clearElapsedTime',
        'showModelList',
        'showWarning',
        'showError',
        'showGoodbye',
      ]),
    };
    expect(instance).toBeTruthy();
  });
});
