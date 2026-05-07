export abstract class DomainError extends Error {
  public readonly timestamp: string;

  constructor(
    public override readonly message: string,
    public readonly code: string,
    public readonly source: string
  ) {
    super(message);
    this.name = this.constructor.name;
    const yyyymmdd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.timestamp = yyyymmdd

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
