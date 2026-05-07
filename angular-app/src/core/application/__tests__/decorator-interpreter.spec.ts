import { DecoratorInterpreter } from '../decorator/interpreter/decorator-interpreter';
import { BaseHelperStrategy } from '../decorator/helpers/strategies/abstracts/base-helper-strategy';
import { UserAction } from '../enums/user-action';
import { BaseDomain } from '../../domain/abstracts/base-domain';

class TestDomain extends BaseDomain {
  constructor() {
    super({
      chat: { completions: { create: jasmine.createSpy('create') } },
      models: { list: jasmine.createSpy('list').and.returnValue({ data: [] }) },
    } as never, 'test');
  }

  static override getDomainName(): string {
    return 'Test';
  }

  protected _fetchDomainNames(): string[] {
    return [];
  }

  buildResponseMessages(): string {
    return '';
  }

  sendMessage(): Promise<string> {
    return Promise.resolve('');
  }

  async listModels(): Promise<string[]> {
    return [];
  }
}

class MessageStrategy extends BaseHelperStrategy {
  canHandle(normalized: string): boolean {
    return normalized === 'message';
  }

  handle(): [UserAction, string | import('../strategies/abstracts/base-application-strategy').DomainConstructor | null] {
    return [UserAction.MESSAGE, 'hello'];
  }
}

class ClearStrategy extends BaseHelperStrategy {
  canHandle(normalized: string): boolean {
    return normalized === 'cls';
  }

  handle(): [UserAction, string | import('../strategies/abstracts/base-application-strategy').DomainConstructor | null] {
    return [UserAction.CLEAR, null];
  }
}

describe('DecoratorInterpreter', () => {
  it('interprets matched strategies and reports expected aliases', () => {
    const presenter = jasmine.createSpyObj('OutputPresenter', ['showInterpretedInput']);
    const interpreter = new DecoratorInterpreter([new ClearStrategy(), new MessageStrategy()]);

    const result = interpreter.interpretUserInputWithFeedback('cls', presenter);
    expect(result[0]).toBe(UserAction.CLEAR);

    const fallback = interpreter.interpretUserInputWithFeedback('message', presenter);
    expect(fallback[0]).toBe(UserAction.MESSAGE);
    expect(fallback[1]).toBe('hello');
  });
});
