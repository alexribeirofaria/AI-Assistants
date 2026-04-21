import { Registry } from './registry';

export class Repository {
  constructor(public readonly registry: Registry = new Registry()) {}
}
