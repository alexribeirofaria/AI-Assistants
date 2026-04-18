import { Component } from "@angular/core";

import { overrideBrowserAlert } from "./shared/components/alert/alert.override";
import { AlertService } from "./shared/services/alert/alert.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: false,
})
export class AppComponent {
  constructor(alertService: AlertService) {
    overrideBrowserAlert(alertService);
  }
}
