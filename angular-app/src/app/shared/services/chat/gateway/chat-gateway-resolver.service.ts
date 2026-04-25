import { Inject, Injectable } from '@angular/core';

import { CoreChatGateway } from './core/core-chat-gateway';
import { HttpChatGateway } from './http/http-chat.gateway';
import { IChatGateway } from './i-chat-gateway';

@Injectable({
  providedIn: 'root',
})
export class ChatGatewayResolverService {
  constructor(
    @Inject(CoreChatGateway)
    private readonly coreGateway: IChatGateway,
    @Inject(HttpChatGateway)
    private readonly httpGateway: IChatGateway
  ) {}

  public resolveChain(): IChatGateway {
    return this.isCliRuntime() ? this.coreGateway : this.httpGateway;
  }

  private isCliRuntime(): boolean {
    return typeof window === 'undefined';
  }
}
