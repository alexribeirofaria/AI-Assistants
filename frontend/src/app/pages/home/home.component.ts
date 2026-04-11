import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertComponent, AlertType } from "../../components";
import { AuthService, AcessoService, AuthGoogleService } from "../../services";
import { isNativeMobile } from "../../utils/platform.utils";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})

export class HomeComponent implements OnInit {
  homeForm: FormGroup;
  showPassword = false;
  eyeIconClass: string = 'bi-eye';

  constructor(
    private platform: Platform,
    private formbuilder: FormBuilder,
    public router: Router,
    public acessoService: AcessoService,
    public authService: AuthService,
    public authProviderGoogleService: AuthGoogleService,
    public modalALert: AlertComponent) {
    this.platform.ready().then(() => {
      if (isNativeMobile()) {
        const elements = document.querySelectorAll('.g_signin');
        elements.forEach(el => el.remove());
      }
    });
  }

  public ngOnInit(): void {
    this.homeForm = this.formbuilder.group({
      email: ["user@example.com", [Validators.required, Validators.email]],
      senha: ["12345T!", [Validators.required, Validators.nullValidator]]
    }) as FormGroup;
  }
 
}
