import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../../core/services/auth.service";
import {AuthenticationRequest} from "../../../core/models/authentication-request";

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
})
export default class AuthSigninComponent {
  formData: AuthenticationRequest = {
    email: '',
    password: '',
  };

  isLoading = false;
  errorMessage = '';

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(this.formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isBanned) {
          this.router.navigate(['/auth/banned']);
          return;
        }
        if (!res.isActive) {
          this.router.navigate(['/auth/not-activated'], { state: { email: this.formData.email } });
          return;
        }
        if (res.role === '[ROLE_EXPERT]' && !res.isValidated) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/auth/expert-not-validated']);
          return;
        }
        if (res.role === '[ROLE_ADMIN]') {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/admin/dashboard']);
          localStorage.setItem('role', res.role);
          return;
        }
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.router.navigate(['/']);

      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.errorMessage = err.error?.businessErrorDescription || 'Login failed. Please try again.';
        if (this.errorMessage === 'Compte non activé, un nouveau message de vérification a été envoyé à votre adresse e-mail.' ) {
          this.router.navigate(
            ['/auth/not-activated'],
            { state: { email: this.formData.email } }
          );
          return;
        }},
    });
  }
}
