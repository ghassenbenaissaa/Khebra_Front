import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-auth-type',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './auth-type.component.html',
  styleUrl: './auth-type.component.scss'
})
export class AuthTypeComponent {
  selectedType: string = '';

  constructor(private router: Router) {}

  validateChoice() {
    if (this.selectedType) {
      sessionStorage.setItem('userType', this.selectedType);
      this.router.navigate(['/auth/signup']);
    }
  }
}
