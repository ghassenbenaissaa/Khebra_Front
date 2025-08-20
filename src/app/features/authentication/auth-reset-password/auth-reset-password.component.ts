import { Component } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-auth-reset-password',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss'],
})
export default class AuthResetPasswordComponent {
  token = '';
  newPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !this.token) {
      this.errorMessage = 'Missing token or password.';
      return;
    }
    this.isLoading = true;
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Password reset successfully. You can now log in.';
        setTimeout(() => this.router.navigate(['/auth/signin']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to reset password.';
      },
    });
  }
}
