export class ModelVo {
  private readonly value: string;

  constructor(model: string) {
    this.value = model.trim();
  }

  public toString(): string {
    return this.value;
  }

  public isEmpty(): boolean {
    return this.value.length === 0;
  }
}
