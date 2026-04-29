import { BaseDomain } from "../../../domain";
import { Builder, RepositoryStrategy } from "../../repository";

describe('RepositoryStrategy Unit Tests', () => {
  it('delegates domain creation to the builder', () => {
    const domain = {} as BaseDomain;
    const builder = {
      buildDomain: jasmine.createSpy('buildDomain').and.returnValue(domain),
    } as unknown as Builder;
    const strategy = new RepositoryStrategy(builder);

    const result = strategy.buildDomain();

    expect(builder.buildDomain).toHaveBeenCalledTimes(1);
    expect(result).toBe(domain);
  });
});
