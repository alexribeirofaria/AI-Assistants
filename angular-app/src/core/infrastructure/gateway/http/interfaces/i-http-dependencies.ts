import { HttpClient } from "@angular/common/http";
import { ServiceErrorHandlerService } from "../../../errors/services/service-error-handler.service";

export interface IHttpDependencies {
  http?: HttpClient;
  errorHandler?: ServiceErrorHandlerService;
}
