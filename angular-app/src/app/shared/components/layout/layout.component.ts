import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true
})

export class LayoutComponent implements OnInit {
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize = (): void => {
  }
}