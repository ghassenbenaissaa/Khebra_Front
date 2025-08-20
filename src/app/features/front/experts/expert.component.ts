import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Expert } from "../../../core/models/expert";
import { ExpertService } from "../../../core/services/expert.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-experts',
  templateUrl: './expert.component.html',
  styleUrls: ['./expert.component.css']
})
export class ExpertComponent {
  selectedExpert: Expert | null = null;
  experts: Expert[] = [];
  currentPage: number = 0;
  pageSize: number = 6;
  totalPages: number = 0;
  filteredExperts: Expert[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  showToast: boolean = false;

  // Store current filters
  currentFilters: any = {
    domain: null,
    radius: null,
    minRating: null,
    maxRating: null,
    lat: null,        // ➕ add this
    lng: null         // ➕ add this
  };

  constructor(
    private expertService: ExpertService,

    private route: ActivatedRoute,
    private router: Router // Ajout du Router

  ) {}

  ngOnInit(): void {
    // Récupérer les paramètres de requête de l'URL
    this.route.queryParams.subscribe(params => {
      if (params['domain']) {
        this.currentFilters.domain = params['domain'];
        console.log('Domain filter from URL:', params['domain']);
      }
      this.loadExperts(this.currentPage);
    });
  }

  loadExperts(page: number): void {
    this.isLoading = true;
    const domain = this.currentFilters.domain || undefined;
    const radiusKm = this.currentFilters.radiusKm || undefined;
    const minRating = this.currentFilters.minRating || undefined;
    const maxRating = this.currentFilters.maxRating || undefined;

      // Sinon utiliser getExperts avec tous les filtres
      this.expertService.getExperts(page, this.pageSize, domain,minRating,maxRating,this.currentFilters.lat,this.currentFilters.lng,radiusKm).subscribe({
        next: (data) => {
          this.experts = data.content;
          this.filteredExperts = [...this.experts];
          this.totalPages = data.totalPages;
          this.currentPage = data.number;
          this.isLoading = false;

        },
        error: (error) => {
          this.isLoading = false;
          this.experts = [];
          this.filteredExperts = [];

          this.showError(error.error.businessErrorDescription);
        }

      });
    }


  viewProfile(expert: Expert) {
    localStorage.setItem('selectedExpertEmail', expert.email);
    this.router.navigate(['/expertDetails']);
  }

  backToList() {
    this.selectedExpert = null;
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadExperts(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.loadExperts(this.currentPage - 1);
    }
  }

  applyFilters(filters: any) {
    console.log('Applying filters:', filters);

    // Store current filters
    this.currentFilters = { ...filters };

    // Reset to first page when filters change
    this.currentPage = 0;

    // Reload data with new domain filter
    this.loadExperts(this.currentPage);
  }

  showError(message: string) {
    this.errorMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
      this.errorMessage = '';
    }, 4000);
  }


}
