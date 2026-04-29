import { BaseAIAssistantApp } from './abstracts/base-ai-assistant-app';
import { ThreadController } from './controller/thread-controller';
import { DecoratorTextHelper } from './decorator/helpers/decorator-text-helper';
import { DecoratorInterpreterFactory } from './decorator/interpreter/decorator-interpreter-factory';
import { UserAction } from './enums/user-action';
import { IAssistantResponse } from './responses/i-assistant-response';
import { IChangeProviderResponse } from './interfaces/i-change-provider-response';
import { IChatAssistantApp } from './interfaces/i-chat-assistant-app';
import { IChatModel } from './interfaces/i-chat-model';
import { IModelsListResponse } from './responses/i-models-list-response';
import { QueueState } from './interfaces/i-queue-state';
import { BaseApplicationStrategy, DomainConstructor } from './strategies/abstracts/base-application-strategy';

export class AIAssistantApp extends BaseAIAssistantApp implements IChatAssistantApp {
  private static readonly helpCommands = new Set(['help', 'ajuda', 'comandos']);

  private _queue: QueueState | null = null;
  private threadController!: ThreadController;
  private currentProvider = this.strategyFactory.defaultDomain;
  private strategy: BaseApplicationStrategy | null = null;
  private interpreter = DecoratorInterpreterFactory.create();
  private selectedModel?: string;

  private resolveStrategy(provider?: string | DomainConstructor | null): BaseApplicationStrategy {
    if (!provider) {
      if (!this.strategy) {
        this.strategy = this.strategyFactory.getStrategy(this.currentProvider);
      }

      return this.strategy;
    }

    const domain = this.strategyFactory.parseDomain(provider);
    if (!domain) {
      throw new Error(`Provider não suportado: ${provider}`);
    }

    return this.strategyFactory.getStrategy(domain);
  }

  private getCurrentDomainName(): string {
    return this.getCurrentStrategy().domainClass.getDomainName().trim();
  }

  private getCurrentStrategy(): BaseApplicationStrategy {
    return this.resolveStrategy();
  }

  private getProviderLabel(provider?: string | DomainConstructor | null): string {
    return this.resolveStrategy(provider).domainClass.getDomainName().trim();
  }

  private async listModelNames(
    provider?: string | DomainConstructor | null,
    searchQuery?: string,
    prefix?: string
  ): Promise<string[]> {
    const { names } = await this.resolveStrategy(provider).listDomains();
    const normalizedPrefix = prefix?.trim().toLowerCase();
    const normalizedSearchQuery = searchQuery?.trim().toLowerCase();

    return names.filter((name) => {
      const normalizedName = name.toLowerCase();

      if (normalizedPrefix && !normalizedName.startsWith(normalizedPrefix)) {
        return false;
      }

      if (normalizedSearchQuery && !normalizedName.includes(normalizedSearchQuery)) {
        return false;
      }

      return true;
    });
  }

  private async handleAction(action: UserAction, value: string | DomainConstructor | null): Promise<boolean> {
    switch (action) {
      case UserAction.EXIT:
        this.queue;
        this.threadController.stopThreads(true);
        this.presenterInstance.showGoodbye();
        return true;
      case UserAction.SWITCH_MODEL:
        this.handleProviderSwitch(value);
        return false;
      case UserAction.LIST_MODELS: {
        const { header, names, prefix } = await this.getCurrentStrategy().listDomains();
        this.presenterInstance.showModelList(header, names, prefix);
        return false;
      }
      case UserAction.CLEAR:
        this.clearScreen();
        this.presenterInstance.showUI();
        return false;
      case UserAction.MESSAGE:
        this.enqueueMessage(typeof value === 'string' ? value : '');
        return false;
      default:
        return false;
    }
  }

  private handleProviderSwitch(value: string | DomainConstructor | null): void {
    if (!value) {
      this.presenterInstance.showWarning(`Modelo invalido: ${String(value)}`);
      return;
    }

    try {
      this.switchProvider(value, true);
    } catch {
      this.presenterInstance.showWarning(`Modelo invalido: ${String(value)}`);
    }
  }

  private enqueueMessage(value: string): void {
    this.queue;
    this.threadController.enqueueTask('message', this.getCurrentStrategy().domainClass, value);
  }

  private async executeMessage(prompt: string): Promise<string> {
    const strategy = this.getCurrentStrategy();
    strategy.useModel(this.selectedModel);
    return strategy.execute(prompt);
  }

  private switchProvider(provider: string | DomainConstructor, announceChange: boolean): void {
    const strategy = this.resolveStrategy(provider);

    this.currentProvider = strategy.domainClass.name;
    this.strategy = strategy;
    this.selectedModel = undefined;

    if (announceChange) {
      this.presenterInstance.showModelSwitched(strategy.domainClass.getDomainName().trim());
    }
  }

  private async buildModels(provider?: string): Promise<IChatModel[]> {
    return (await this.listModels(provider)).models;
  }

  private resolveDefaultModelFromList(
    provider: string | DomainConstructor | null | undefined,
    models: IChatModel[]
  ): string | undefined {
    const currentModel = this.resolveStrategy(provider).getCurrentModel();

    if (this.selectedModel && models.some((model) => model.id === this.selectedModel)) {
      return this.selectedModel;
    }

    if (models.some((model) => model.id === currentModel)) {
      return currentModel;
    }

    const firstModel = models[0]?.id;
    if (firstModel?.startsWith('[ERROR]')) {
      return currentModel;
    }

    return firstModel ?? currentModel;
  }

  private isHelpCommand(input: string): boolean {
    return AIAssistantApp.helpCommands.has(DecoratorTextHelper.normalizeText(input).replace(/ /g, ''));
  }

  get defaultModelAgent(): string {
    return this.currentProvider;
  }

  get queue(): QueueState {
    if (!this._queue) {
      this._queue = { tasks: [] };
      this.threadController = new ThreadController(this.presenterInstance, this.strategyFactory);
    }

    return this._queue;
  }

  override _handleAction(action: string, value: string | DomainConstructor | null): Promise<boolean> {
    return this.handleAction(action as UserAction, value);
  }

  override runApp(): void {
    this.presenterInstance.showUI();
  }

  getInputPrompt(): string {
    return this.presenterInstance.getInputPrompt(
      this.getCurrentDomainName(),
      this.getCurrentStrategy().getCurrentModel()
    );
  }

  async getProviders(): Promise<string[]> {
    return this.strategyFactory
      .available()
      .map((domain) => domain.getDomainName().trim());
  }

  async listModels(provider?: string, searchQuery?: string, prefix?: string): Promise<IModelsListResponse> {
    const models = (await this.listModelNames(provider, searchQuery, prefix)).map((modelName) => ({
      id: modelName,
      modelName,
      provider: this.getProviderLabel(provider),
    }));

    return {
      defaultModel: this.resolveDefaultModelFromList(provider, models),
      models,
    };
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    return this.resolveDefaultModelFromList(provider, await this.buildModels(provider));
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    this.switchProvider(provider, false);
    return { status: 'ok' };
  }

  selectModel(model?: string): void {
    this.selectedModel = model?.trim() || undefined;
  }

  async sendMessage(content: string): Promise<IAssistantResponse> {
    const responseText = await this.executeMessage(content);

    return {
      input: content,
      response: {
        model: this.getCurrentStrategy().getCurrentModel(),
        response: responseText,
      },
    };
  }

  async processInput(input: string): Promise<boolean> {
    const rawInput = (input ?? '').trim();
    if (!rawInput) {
      return false;
    }

    if (this.isHelpCommand(rawInput)) {
      this.presenterInstance.showUI();
      return false;
    }

    const [action, value] = this.interpreter.interpretUserInputWithFeedback(rawInput, this.presenterInstance);

    if (action !== UserAction.MESSAGE) {
      return this.handleAction(action, value);
    }

    const prompt = typeof value === 'string' && value ? value : rawInput;
    const response = await this.executeMessage(prompt);
    this.presenterInstance.showResponse(this.getCurrentDomainName(), response);
    return false;
  }
}
