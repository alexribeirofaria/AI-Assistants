import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from "./home.component";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { HomeRoutingModule } from "./home.routing.module";
import { FooterComponent } from "../../components/footer/footer.component";

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, MatInputModule, MatIconModule, ReactiveFormsModule, FooterComponent],
  exports: [HomeComponent]
})

export class HomeModule { }
