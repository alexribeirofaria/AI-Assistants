import { GroqDomain } from "../../domain";
import { BaseApplicationStrategy } from "./abstracts/base-application-strategy";

export class GroqStrategy extends BaseApplicationStrategy {
  constructor() {
    super(GroqDomain);
  }
}
