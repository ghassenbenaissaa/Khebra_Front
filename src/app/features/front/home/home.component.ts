import { Component } from '@angular/core';
import {ExpertService} from "../../../core/services/expert.service";
import {Expert} from "../../../core/models/expert";
import { DomaineService } from '../../../core/services/domaine.service';
import { domaineResponse } from '../../../core/models/domaine-response';
import { Router } from '@angular/router';
import { FastAPIService } from '../../../core/services/fast-api.service';
import { recommendationRequest } from '../../../core/models/recommendation-request';
import { expertOut } from '../../../core/models/expert-response';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  experts: Expert[];
  domaines: domaineResponse[] = [];
  isAuthenticated: boolean = false;
  problemDescription: string = '';

  constructor(
    private expertService: ExpertService, 
    private domaineService: DomaineService, 
    private router: Router,
    private fastAPIService: FastAPIService
  ) {}

  ngOnInit(): void {
    // Just set the page and size statically here
    const page = 0;
    const size = 6;
    this.isAuthenticatedd();
    this.expertService.getExperts(page, size).subscribe({
      next: (response) => {
        this.experts = response.content;
      },
      error: (err) => {
        console.error('Failed to load homepage experts', err);
      }
    });
    this.domaineService.getDomaines().subscribe({
      next: (response: any) => {
        // response can be array or paginated, adapt as needed
        this.domaines = Array.isArray(response) ? response : response.content;
      },
      error: (err) => {
        console.error('Failed to load domaines', err);
      }
    });
  }

  viewProfile(expert: Expert) {
    localStorage.setItem('selectedExpertEmail', expert.email);
    this.router.navigate(['/expertDetails']);
  }

  isAuthenticatedd() {
    if (localStorage.getItem('token') !== null) {
      this.isAuthenticated = true;
    }
    return this.isAuthenticated;
  }

  onProblemInput(event: any) {
    this.problemDescription = event.target.value;
  }

  onEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.problemDescription.trim()) {
      this.getRecommendations();
    }
  }

  getRecommendations() {
    if (!this.problemDescription.trim()) {
      Swal.fire('Champ vide', 'Veuillez décrire votre problème', 'warning');
      return;
    }

    const request: recommendationRequest = {
      problem: this.problemDescription.trim(),
      top_k: 5,
      min_similarity: 0.3
    };

    this.fastAPIService.recommendExperts(request).subscribe({
      next: (experts: expertOut[]) => {
        if (experts && experts.length > 0) {
          this.showRecommendationsModal(experts);
        } else {
          Swal.fire('Aucune recommandation', 'Aucun expert ne correspond à votre problème', 'info');
        }
      },
      error: (error) => {
        console.error('Erreur lors de la recommandation:', error);
        Swal.fire(
          'Aucune recommandation',
          'Aucun expert ne correspond à votre problème. Essayez de reformuler votre phrase afin que nous puissions trouver des similarités.',
          'info'
      );
      
      }
    });
  }

  showRecommendationsModal(experts: expertOut[]) {
    const customStyles = `
      <style>
        .experts-container {
          max-height: 70vh;
          overflow-y: auto;
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
        }
        
        .expert-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .expert-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-color: #007bff;
        }
        
        .expert-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #007bff, #0056b3, #004085);
          border-radius: 16px 16px 0 0;
        }
        
        .expert-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .expert-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
          background: linear-gradient(135deg, #2c3e50, #34495e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .similarity-badge {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .expert-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .info-item {
          background: #f8f9fa;
          padding: 12px 16px;
          border-radius: 12px;
          border-left: 4px solid #007bff;
        }
        
        .info-label {
          font-size: 0.8rem;
          color: #6c757d;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          font-size: 1rem;
          color: #495057;
          font-weight: 500;
          margin: 0;
        }
        
        .expert-bio {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          border-left: 4px solid #28a745;
        }
        
        .bio-text {
          color: #495057;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
          font-style: italic;
        }
        
        .view-profile-btn {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .view-profile-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
          background: linear-gradient(135deg, #0056b3, #004085);
        }
        
        .expert-count {
          text-align: center;
          margin-bottom: 20px;
          padding: 12px;
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          border-radius: 12px;
          border: 2px solid #2196f3;
        }
        
        .count-text {
          color: #1565c0;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 0;
        }
        
        .scroll-indicator {
          text-align: center;
          margin-top: 16px;
          color: #6c757d;
          font-size: 0.9rem;
          font-style: italic;
        }
        
        /* Animation d'entrée pour les cartes */
        .expert-card {
          animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .expert-info {
            grid-template-columns: 1fr;
          }
          
          .expert-card {
            padding: 20px;
          }
          
          .expert-name {
            font-size: 1.3rem;
          }
        }
      </style>
    `;

    // Créer le contenu HTML avec le nouveau design
    let expertsHtml = `
      ${customStyles}
      <div class="experts-container">`;
    
    experts.forEach((expert, index) => {
      const similarityPercentage = Math.round(expert.similarity_score * 100);
      const delay = index * 0.1; // Délai d'animation progressif
      
      expertsHtml += `
        <div class="expert-card" style="animation-delay: ${delay}s;">
          <div class="expert-header">
            <h3 class="expert-name">${expert.firstname} ${expert.lastname}</h3>
          </div>
          
          <div class="expert-info">
            <div class="info-item">
              <div class="info-label">🏷️ Domaine</div>
              <p class="info-value">${expert.domaine}</p>
            </div>
            <div class="info-item">
              <div class="info-label">⚡ Expertise</div>
              <p class="info-value">${expert.expertise}</p>
            </div>
          </div>
          
          <div class="expert-bio">
            <p class="bio-text">
              ${expert.biographie ? expert.biographie.substring(0, 120) + '...' : 'Aucune biographie disponible pour le moment.'}
            </p>
          </div>
          
          <button onclick="window.viewExpertProfile('${expert.email}')" class="view-profile-btn">
            👤 Voir le profil complet
          </button>
        </div>
      `;
    });

    expertsHtml += `
      </div>
    `;

    // Configuration améliorée de SweetAlert2
    Swal.fire({
      title: '<div style="font-size: 2rem; font-weight: 700; color: #2c3e50; margin-bottom: 10px;">Experts Recommandés</div>',
      html: expertsHtml,
      width: '800px',
      showConfirmButton: false,
      showCloseButton: true,
      closeButtonHtml: '<span style="font-size: 1.5rem; color: #6c757d;">&times;</span>',
      customClass: {
        popup: 'swal2-custom-popup',
        closeButton: 'swal2-custom-close'
      },
      didOpen: () => {
        // Ajouter des styles personnalisés pour SweetAlert2
        const style = document.createElement('style');
        style.textContent = `
          .swal2-custom-popup {
            border-radius: 20px !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
          }
          
          .swal2-custom-close {
            position: absolute !important;
            top: 15px !important;
            right: 20px !important;
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            background: #f8f9fa !important;
            border: 2px solid #e9ecef !important;
            transition: all 0.3s ease !important;
          }
          
          .swal2-custom-close:hover {
            background: #e9ecef !important;
            transform: scale(1.1) !important;
          }
        `;
        document.head.appendChild(style);
      }
    });

    // Fonction globale pour voir le profil
    (window as any).viewExpertProfile = (email: string) => {
      localStorage.setItem('selectedExpertEmail', email);
      this.router.navigate(['/expertDetails']);
      Swal.close();
    };
  }
}
