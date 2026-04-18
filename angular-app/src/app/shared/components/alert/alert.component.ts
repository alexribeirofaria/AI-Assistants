import { Component, Input } from "@angular/core";
import {
  NgbModalConfig,
  NgbModal,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { AlertService } from "../../services/alert/alert.service";

@Component({
  selector: "app-alert-component",
  templateUrl: "./alert.component.html",
  styleUrl: "./alert.component.scss",
  standalone: false,
})
export class AlertComponent {
  @Input() header = "Mensagem";
  alertTypeClass = "alert alert-success mt-2";
  public alert = this.alertService.alert$;

  constructor(
    config: NgbModalConfig,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  open(content: any, _message: string, typeAlert: AlertType) {
    const modalRef = this.modalService.open(content);
    modalRef.componentInstance.alertTypeClass = AlertTypeClass[typeAlert];
    modalRef.componentInstance.message = _message;
    return modalRef;
  }

  close(): void {
    this.activeModal.close();
    this.alertService.hide();
  }
}

export enum AlertType {
  Success = 0,
  Warning = 1,
}
const AlertTypeClass: Record<AlertType, string> = {
  0: "alert alert-success mt-2 bi bi-emoji-smile",
  1: "alert alert-danger mt-2 bi bi-exclamation-circle",
};
