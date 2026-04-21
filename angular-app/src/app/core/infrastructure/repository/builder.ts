import { BaseServer } from '../servers/abstracts/base-server';
import { OpenAIServer } from '../servers/openai-server';

export class Builder {
  private _server: BaseServer | null;
  private readonly _serverFactory: () => BaseServer;

  constructor(
    server: BaseServer | null = null,
    serverFactory: () => BaseServer = () => new OpenAIServer()
  ) {
    this._server = server;
    this._serverFactory = serverFactory;
  }

  get server(): BaseServer {
    if (!this._server) {
      this._server = this._serverFactory();
    }
    return this._server;
  }
}
