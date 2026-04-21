import { BaseAIAssistantApp } from './abstracts/base-ai-assistant-app';
import { ThreadController } from './controller/thread-controller';
import { UserAction } from './enums/user-action';
import { DecoratorInterpreterFactory } from './decorator/helpers/interpreter/decorator-interpreter-factory';
import { BaseApplicationStrategy, DomainConstructor } from './strategies/abstracts/base-application-strategy';

interface QueueState {
  tasks: Array<{ kind: 'message'; payload: string }>;
}

interface WebAppResult {
  response?: Promise<string>;
  header?: string;
  names?: string[];
  prefix?: string;
  message?: string;
  model?: string;
}

export class AIAssistantApp extends BaseAIAssistantApp {
  override _handleAction(action: string, value: string | DomainConstructor | null): boolean {
    return this.handleAction(action as UserAction, value);
  }

  private _queue: QueueState | null = null;
  private threadController!: ThreadController;
  private _defaultModelAgent: string | DomainConstructor = this.strategyFactory.defaultDomain;
  private strategy: BaseApplicationStrategy | null = null;
  private interpreter = DecoratorInterpreterFactory.create();

  get defaultModelAgent(): string | DomainConstructor {
    return this._defaultModelAgent;
  }

  set defaultModelAgent(value: string | DomainConstructor) {
    this._defaultModelAgent = value;
  }

  get queue(): QueueState {
    if (!this._queue) {
      this._queue = { tasks: [] };
      this.threadController = new ThreadController(this.presenterInstance, this.strategyFactory);
    }
    return this._queue;
  }

  private getCurrentStrategy(): BaseApplicationStrategy {
    if (!this.strategy) {
      this.strategy = this.strategyFactory.getStrategy(this.defaultModelAgent);
    }
    return this.strategy;
  }

  private handleAction(action: UserAction, value: string | DomainConstructor | null, stopApp: boolean = true): boolean {
    if (action === UserAction.EXIT) {
      this.queue;
      if (stopApp) {
        this.threadController.stopThreads(true);
        this.presenterInstance.showGoodbye();
        return true;
      } else {
        this.threadController.stopThreads(false);
        return false;
      }
    }

    if (action === UserAction.SWITCH_MODEL) {
      const parsed = typeof value === 'string' || typeof value === 'function'
        ? this.strategyFactory.parseDomain(value)
        : null;
      if (parsed) {
        this.defaultModelAgent = parsed;
        this.strategy = null;
        this.presenterInstance.showModelSwitched(parsed.getDomainName());
      } else {
        this.presenterInstance.showWarning(`Modelo invalido: ${String(value)}`);
      }
    }

    if (action === UserAction.LIST_MODELS) {
      const { header, names, prefix } = this.getCurrentStrategy().listDomains();
      this.presenterInstance.showModelList(header, names, prefix);
    }

    if (action === UserAction.CLEAR) {
      this.clearScreen();
      this.presenterInstance.showUI();
    }

    if (action === UserAction.MESSAGE) {
      this.queue;
      const payload = typeof value === 'string' ? value : '';
      const strategy = this.getCurrentStrategy();
      this.threadController.enqueueTask('message', strategy.domainClass, payload);
    }

    return false;
  }

  runWebApp(message: string): WebAppResult {
    if (this.queue.tasks.length > 0) {
      this.threadController.showElapsedTimeUntilQueueFinishes();
    }

    const [action, value] = this.interpreter.interpretUserInputWithFeedback(message, this.presenterInstance);

    if (action === UserAction.LIST_MODELS) {
      const { header, names, prefix } = this.getCurrentStrategy().listDomains();
      return { header, names, prefix };
    }

    if (action === UserAction.SWITCH_MODEL) {
      this.handleAction(action, value, false);
      const newModel = typeof this.defaultModelAgent === 'string'
        ? this.defaultModelAgent
        : this.defaultModelAgent.getDomainName();
      return { message: 'model_switched', model: newModel };
    }

    const strategy = this.getCurrentStrategy();
    const prompt = action === UserAction.MESSAGE && typeof value === 'string' && value ? value : message;
    const response = strategy.execute(prompt);
    return { response };
  }

  // Additional methods: list_models, get_default_model, etc. as per Python
  listModels(searchQuery?: string, prefix?: string, provider?: string): string[] {
    let strategy = this.getCurrentStrategy();
    if (provider) {
      const parsed = this.strategyFactory.parseDomain(provider);
      if (parsed) strategy = this.strategyFactory.getStrategy(parsed);
    }

    const { header, names } = strategy.listDomains();
    let filteredNames = names;

    if (prefix) {
      const normalizedPrefix = prefix.toLowerCase().trim();
      filteredNames = names.filter((name: string) => name.toLowerCase().startsWith(normalizedPrefix));
    }

    if (searchQuery) {
      const normalized = searchQuery.toLowerCase().trim();
      filteredNames = filteredNames.filter((name: string) => name.toLowerCase().includes(normalized));
    }

    return filteredNames;
  }

  runConsoleApp(): void {
    this.presenterInstance.showUI();
    // Simplified console loop - for Angular use web app
  }

  // ... other methods
}
