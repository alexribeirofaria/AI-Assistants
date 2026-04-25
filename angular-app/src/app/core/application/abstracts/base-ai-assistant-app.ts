import { OutputPresenter, OutputPresenterFactory } from '../../presentation';
import { DomainConstructor } from '../strategies/abstracts/base-application-strategy';
import { StrategyApplicationFactory } from '../strategies/factories/strategy-application-factory';

export abstract class BaseAIAssistantApp {
  protected readonly strategyFactory: StrategyApplicationFactory;
  protected presenter: OutputPresenter | null = null;
  protected presenterFactory: OutputPresenterFactory | null = null;

  constructor(
    strategyFactory: StrategyApplicationFactory | null = null,
    presenter: OutputPresenter | null = null,
    presenterFactory: OutputPresenterFactory | null = null
  ) {
    this.strategyFactory = strategyFactory || new StrategyApplicationFactory();
    this.presenterFactory = presenterFactory;
    this.presenter = presenter;
  }

  get presenterInstance(): OutputPresenter {
    if (!this.presenter) {
      this.presenter = this.buildPresenter();
    }
    return this.presenter;
  }

  private buildPresenter(): OutputPresenter {
    if (this.presenterFactory) {
      return this.presenterFactory.createPresenter();
    }
    const factory = new OutputPresenterFactory();
    return factory.createPresenter();
  }

  clearScreen(): void {
    console.clear();
  }

  abstract runApp(): void;

  abstract _handleAction(action: string, value: string | DomainConstructor | null): Promise<boolean>;
}
