import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-auth-activate-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-activate-account.component.html',
  styleUrls: ['./auth-activate-account.component.scss'],
})
export class AuthActivateAccountComponent implements OnInit {
  loading = true;
  success = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.activateAccount(token).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.businessErrorDescription || 'Activation failed.';
          this.loading = false;
        },
      });
    } else {
      this.error = "Veuillez insérer un code d'activation.";
      this.loading = false;
    }
  }
}
