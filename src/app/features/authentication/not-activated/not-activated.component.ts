import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-not-activated',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-activated.component.html',
  styleUrls: ['./not-activated.component.scss'],
})
export class NotActivatedComponent {
  email: string = '';
  message: string = '';
  isLoading = false;

  constructor(private router: Router, private authService: AuthService) {
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras?.state?.['email'] || '';
  }

  resendActivation() {
    if (!this.email) {
      this.message = 'Adresse e-mail manquante. Veuillez revenir à la page de connexion et réessayer.';
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.authService.ResendValidationEmail(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        // 202 Accepted from backend → treat as success
        this.message = 'E-mail d’activation envoyé. Veuillez vérifier votre boîte de réception.';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = err?.error?.businessErrorDescription || 'Échec de l’envoi de l’e-mail d’activation. Veuillez réessayer.';
      },
    });
  }
}
