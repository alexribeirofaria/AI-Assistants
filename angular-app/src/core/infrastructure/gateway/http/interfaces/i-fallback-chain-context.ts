export interface IFallbackChainContext<THandler, TResult> {
  handlers: readonly THandler[];
  operation: (handler: THandler) => Promise<TResult>;
  validate?: (result: TResult) => boolean;
  invalidResultMessage?: string;
}
