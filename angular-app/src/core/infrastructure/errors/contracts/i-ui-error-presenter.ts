export interface IUIErrorPresenter {
  present(message: string, channel?: 'chat' | 'global'): void;
}
