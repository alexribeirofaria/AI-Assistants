import { OpenAI } from "../../domain";
import { BaseApplicationStrategy } from "./abstracts/base-application-strategy";

export class OpenAIStrategy extends BaseApplicationStrategy {
  constructor() {
    super(OpenAI);
  }
}
