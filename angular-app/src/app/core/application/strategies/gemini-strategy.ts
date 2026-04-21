
import { GeminiDomain } from '../../domain';
import { BaseApplicationStrategy } from './abstracts/base-application-strategy';

export class GeminiStrategy extends BaseApplicationStrategy {
  constructor() {
    super(GeminiDomain);
  }
}
