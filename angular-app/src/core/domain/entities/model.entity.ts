import { ModelVo, ProviderVo } from "../value-objects";

export class Model {
  private constructor(
    public readonly id: string,
    public readonly name: ModelVo,
    public readonly provider: ProviderVo
  ) {
    this.validate();
  }

  static create(props: {
    id: string;
    name: string;
    provider: string;
  }): Model {

    if (!props.name || !props.name.trim()) {
      throw new Error('Model Name is required');
    }

    if (!props.provider || !props.provider.trim()) {
      throw new Error('Provider Name is required');
    }

    return new Model(
      props.id,
      ModelVo.create(props.name),
      ProviderVo.create({ name: props.provider, active: true})
    );
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('Id é obrigatório');
    }
  }
}
