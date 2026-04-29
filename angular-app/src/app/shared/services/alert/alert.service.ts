import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { AlertModel } from "./alert.model";

@Injectable({ providedIn: "root" })
export class AlertService {
  private subject = new BehaviorSubject<AlertModel | null>(null);
  alert$ = this.subject.asObservable();

  show(alert: AlertModel): void {
    this.subject.next(alert);
  }

  hide(): void {
    this.subject.next(null);
  }
}
