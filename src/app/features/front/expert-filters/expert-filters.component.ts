import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { DomaineService } from '../../../core/services/domaine.service';



@Component({
  selector: 'app-expert-filters',
  templateUrl: './expert-filters.component.html',
})
export class ExpertFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();
  @Input() initialDomain: string = '';

  selectedDomain: string = '';
  minRating: number = 0;
  maxRating: number = 5;
  radiusKm: number = 0;
  lat: number | null = null;
  lng: number | null = null;
  domaineOptions: any[] = [];


  constructor(private domaineService: DomaineService) {}

  ngOnInit() {
    this.domaineService.getDomaines().subscribe((domaines: any) => {
      // Si le backend retourne un tableau direct
      if (Array.isArray(domaines)) {
        this.domaineOptions = domaines;
      } else if (domaines && Array.isArray(domaines.content)) {
        // Si le backend retourne { content: [...] }
        this.domaineOptions = domaines.content;
      }

      // Appliquer le domaine initial si fourni
      if (this.initialDomain) {
        this.selectedDomain = this.initialDomain;
        this.applyFilters();
      }
    });
  }

  applyFilters() {
    this.filtersChanged.emit({
      domain: this.selectedDomain,
      minRating: this.minRating,
      maxRating: this.maxRating,
      radiusKm: this.radiusKm,
      lat: this.lat,
      lng: this.lng,
    });
  }


  clearFilters() {
    this.selectedDomain = '';
    this.minRating = 0;
    this.maxRating = 5;
    this.radiusKm = 0;
    this.applyFilters();
  }
  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.applyFilters(); // Call your filter logic here
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

}
