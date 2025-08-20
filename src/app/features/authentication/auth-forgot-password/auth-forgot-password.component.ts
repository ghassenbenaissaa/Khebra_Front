import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-auth-forgot-password',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './auth-forgot-password.component.html',
  styleUrls: ['./auth-forgot-password.component.scss'],
})
export default class AuthForgotPasswordComponent {
  email = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Reset instructions have been sent to your email.';
      },
      error: (err) => {

        this.isLoading = false;
        this.errorMessage = err.error?.businessErrorDescription || 'Failed to send reset instructions.';
      },
    });
  }
}
