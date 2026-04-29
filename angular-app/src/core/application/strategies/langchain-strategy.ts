import { LangChain } from "../../domain";
import { BaseApplicationStrategy } from "./abstracts/base-application-strategy";

export class LangChainStrategy extends BaseApplicationStrategy {
  constructor() {
    super(LangChain);
  }
}
