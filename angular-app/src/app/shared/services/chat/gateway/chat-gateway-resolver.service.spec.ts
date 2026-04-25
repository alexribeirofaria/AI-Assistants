import { TestBed } from '@angular/core/testing';

import { ChatGatewayResolverService } from './chat-gateway-resolver.service';
import { CoreChatGateway } from './core/core-chat-gateway';
import { HttpChatGateway } from './http/http-chat.gateway';
import { IChatGateway } from './i-chat-gateway';

describe('ChatGatewayResolverService Unit Tests', () => {
  let service: ChatGatewayResolverService;
  let coreGateway: jasmine.SpyObj<IChatGateway>;
  let httpGateway: jasmine.SpyObj<IChatGateway>;

  beforeEach(() => {
    coreGateway = jasmine.createSpyObj<IChatGateway>('CoreChatGateway', [
      'getProviders',
      'getModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
    ]);
    httpGateway = jasmine.createSpyObj<IChatGateway>('HttpChatGateway', [
      'getProviders',
      'getModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ChatGatewayResolverService,
        { provide: CoreChatGateway, useValue: coreGateway },
        { provide: HttpChatGateway, useValue: httpGateway },
      ],
    });

    service = TestBed.inject(ChatGatewayResolverService);
  });

  it('should resolve the core gateway in cli runtime', () => {
    spyOn<any>(service, 'isCliRuntime').and.returnValue(true);

    expect(service.resolveChain()).toBe(coreGateway);
  });

  it('should resolve the http gateway in browser runtime', () => {
    spyOn<any>(service, 'isCliRuntime').and.returnValue(false);

    expect(service.resolveChain()).toBe(httpGateway);
  });
});
