
import { ClaudeDomain } from '../../domain';
import { BaseApplicationStrategy } from './abstracts/base-application-strategy';

export class ClaudeStrategy extends BaseApplicationStrategy {
  constructor() {
    super(ClaudeDomain);
  }
}
