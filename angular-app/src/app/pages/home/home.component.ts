import { Component, inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Platform } from '@ionic/angular';
import { AlertComponent } from '../../shared/components/alert-component/alert.component';
import { AuthService, AuthGoogleService } from "../../shared/services";
import { isNativeMobile } from "../../shared/utils/platform.utils";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})

export class HomeComponent implements OnInit {
  private platform = inject(Platform);
  private fb = inject(FormBuilder);
  public router = inject(Router);
  public authService = inject(AuthService);
  public authGoogleService = inject(AuthGoogleService);
  public alertComponent = inject(AlertComponent);

  homeForm!: FormGroup;
  showPassword = false;
  eyeIconClass = 'bi-eye';

  ngOnInit(): void {
    this.platform.ready().then(() => {
      if (isNativeMobile()) {
        const elements = document.querySelectorAll('.g_signin');
        elements.forEach(el => el.remove());
      }
    });

    this.homeForm = this.fb.group({
      email: ["user@example.com", [Validators.required, Validators.email]],
      senha: ["12345T!", [Validators.required]]
    });
  }
}
