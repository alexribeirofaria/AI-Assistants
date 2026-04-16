import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule],
  exports: [AlertComponent],
  providers: [NgbModalConfig, NgbModal, NgbActiveModal],
})
export class AlertModule { }
