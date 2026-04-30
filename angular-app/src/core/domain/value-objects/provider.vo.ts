export class ProviderVo {
  private readonly value: string;

  constructor(provider: string) {
    this.value = provider.trim();
  }

  public toString(): string {
    return this.value;
  }

  public isEmpty(): boolean {
    return this.value.length === 0;
  }
}
