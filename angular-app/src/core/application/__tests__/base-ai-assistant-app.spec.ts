import { OutputPresenter, OutputPresenterFactory } from '../../presentation';
import { BaseAIAssistantApp } from '../abstracts/base-ai-assistant-app';
import { StrategyApplicationFactory } from '../strategies/factories/strategy-application-factory';
import { DomainConstructor } from '../strategies/abstracts/base-application-strategy';

class TestApp extends BaseAIAssistantApp {
  runApp(): void {}

  override async _handleAction(_action: string, _value: string | DomainConstructor | null): Promise<boolean> {
    return false;
  }
}

describe('BaseAIAssistantApp', () => {
  it('builds a presenter through the injected factory and clears the screen', () => {
    const presenter = jasmine.createSpyObj<OutputPresenter>('OutputPresenter', ['showUI']);
    const presenterFactory = jasmine.createSpyObj<OutputPresenterFactory>('OutputPresenterFactory', ['createPresenter']);
    presenterFactory.createPresenter.and.returnValue(presenter);

    const app = new TestApp(new StrategyApplicationFactory(), null, presenterFactory);
    spyOn(console, 'clear');

    expect(app.presenterInstance).toBe(presenter);
    app.clearScreen();
    expect(console.clear).toHaveBeenCalled();
  });

  it('reuses the presenter instance when provided directly', () => {
    const presenter = jasmine.createSpyObj<OutputPresenter>('OutputPresenter', ['showUI']);
    const app = new TestApp(new StrategyApplicationFactory(), presenter, null);

    expect(app.presenterInstance).toBe(presenter);
    expect(app.presenterInstance).toBe(presenter);
  });
});
