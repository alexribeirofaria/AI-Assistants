import { AlertService } from "../../services/alert/alert.service";

export function overrideBrowserAlert(alertService: AlertService): void {
  const originalAlert = window.alert;

  window.alert = (message?: any): void => {
    // fallback opcional (debug)
    if (!alertService) {
      originalAlert(message);
      return;
    }

    alertService.show({
      message: String(message),
      type: "info",
    });
  };
}
