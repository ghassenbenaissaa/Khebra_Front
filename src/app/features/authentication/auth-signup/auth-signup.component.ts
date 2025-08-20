
import {Component, AfterViewInit} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { RegistrationRequest } from 'src/app/core/models/registration-request';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomaineService } from 'src/app/core/services/domaine.service';
import { domaineResponse } from 'src/app/core/models/domaine-response';

import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss'],
})

export default class AuthSignupComponent implements AfterViewInit  {
  map: L.Map;
  marker: L.Marker;
  private mapInitialized = false;
  domaines: domaineResponse[] = [];

  constructor(private authService: AuthService, private router: Router, private domaineService: DomaineService) {}

  ngOnInit(): void {
    this.domaineService.getDomainesSignUp().subscribe({
      next: (response: any) => {
        this.domaines = Array.isArray(response) ? response : response.content;
      },
      error: (err) => {
        console.error('Failed to load domaines', err);
      }
    });
  }

  ngAfterViewInit() {
    const typeFromSession = sessionStorage.getItem('userType');
    this.formData.userType = typeFromSession === 'Expert' ? 'EXPERT' : 'CLIENT';
    console.log('userType:', this.formData.userType);
    setTimeout(() => this.initMap(), 0);
  }

  initMap() {
    if (this.mapInitialized) return;
    this.mapInitialized = true;
    this.map = L.map('map').setView([36.8065, 10.1815], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.locate({ setView: true, maxZoom: 16 });

    this.marker = L.marker(this.map.getCenter(), { draggable: true }).addTo(this.map);
    this.updateAddress(this.marker.getLatLng());

    this.marker.on('dragend', () => {
      const pos = this.marker.getLatLng();
      this.updateAddress(pos);
    });

    this.map.on('locationfound', (e: L.LocationEvent) => {
      this.marker.setLatLng(e.latlng);
      this.updateAddress(e.latlng);
    });
  }

  updateAddress(latlng: L.LatLng) {
    const lat = latlng.lat;
    const lng = latlng.lng;

    this.formData.point = `${lat},${lng}`;
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          this.formData.address = data.display_name;
        } else {
          this.formData.address = `${latlng.lat},${latlng.lng}`;
        }
      })
      .catch(() => {
        this.formData.address = `${latlng.lat},${latlng.lng}`;
      });

  }

  formData: RegistrationRequest = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    numTel: '',
    cin: '',
    userType: '',
    expertise: '',
    DomaineId: null,
    biographie: '',
    interet: '',
    address: '',
    point: ''
  };

   isLoading = false;
  errorMessage = '';

onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.formData.userType === 'CLIENT' && this.marker) {
      const pos = this.marker.getLatLng();
      this.formData.address = `${pos.lat},${pos.lng}`;
    }
    this.isLoading = true;
    this.authService.register(this.formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/signin']);
      },
      error: (err) => {
        this.isLoading = false;

        if (err.error?.validationErrors?.length) {
          // Take first validation error
          this.errorMessage = err.error.validationErrors[0];
        } else {
          // Fall back to business description or generic message
          this.errorMessage =
            err.error?.businessErrorDescription || 'Registration failed. Try again.';
        }
      }
      ,
    });
  }

}
