import { Component, OnInit } from "@angular/core";
import { FooterComponent } from "../../shared/components";

@Component({
  selector: "app-privacy",
  templateUrl: "./privacy.page.component.html",
  styleUrls: ["./privacy.page.component.scss"],
  imports: [FooterComponent],
  standalone: true,
})
export class PrivacyComponent implements OnInit {
  constructor() {}

  public ngOnInit(): void {}
}
