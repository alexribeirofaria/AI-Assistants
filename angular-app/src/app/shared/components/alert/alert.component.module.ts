import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AlertComponent } from './alert.component';


@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule],
  exports: [AlertComponent],
  providers: [NgbModalConfig, NgbModal, NgbActiveModal],
})
export class AlertModule { }
