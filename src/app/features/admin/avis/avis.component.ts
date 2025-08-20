import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgIf, NgFor } from '@angular/common';
import Swal from 'sweetalert2';
import { AvisService } from 'src/app/core/services/avis.service';
import { AvisAdmin } from 'src/app/core/models/avisAdmin';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CardComponent, NgIf, NgFor],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.scss'
})
export class AvisComponent implements OnInit {
  avis: AvisAdmin[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(private avisService: AvisService, private userService: UserService) {}


  ngOnInit(): void {
    this.getAvis();
  }

  getAvis(): void {
    this.avisService.getAllAvisPaged(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.avis = response.content;
        this.totalItems = response.totalElements;
        console.log(this.avis);
      },
      error: (err) => {
        console.error('Error fetching experts:', err);
      }
    });
  }

  get totalPages(): number {
    return this.totalItems > 0 ? Math.ceil(this.totalItems / this.pageSize) : 1;
  }

  onPageChange(event: { pageIndex: number, pageSize: number }): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAvis();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

  truncateComment(comment: string): string {
    if (!comment) return '';
    return comment.length > 20 ? comment.substring(0, 20) + '...' : comment;
  }

  openAvisDetailsModal(avi: AvisAdmin): void {
    // Déterminer quels boutons afficher
    const showBanClientButton = !avi.clientBanned;
    const showBanExpertButton = !avi.expertBanned;
    const showDisableButton = avi.enabled;
    const showEnableButton = !avi.enabled;

    // Construire les boutons dynamiquement
    let buttonsConfig: any = {
      showCancelButton: true,
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false,
      buttonsStyling: false,
      width: '450px'
    };

    // Ajouter les boutons selon les conditions
    if (showBanClientButton) {
      buttonsConfig.showDenyButton = true;
      buttonsConfig.denyButtonText = '<i class="fa fa-ban"></i> Bannir Client';
      buttonsConfig.customClass = buttonsConfig.customClass || {};
      buttonsConfig.customClass.denyButton = 'btn btn-danger';
    }

    if (showBanExpertButton) {
      buttonsConfig.cancelButtonText = '<i class="fa fa-user-times"></i> Bannir Expert';
      buttonsConfig.customClass = buttonsConfig.customClass || {};
      buttonsConfig.customClass.cancelButton = 'btn btn-warning';
    } else {
      buttonsConfig.showCancelButton = false;
    }

    // Ajouter le bouton d'activation/désactivation
    if (showDisableButton) {
      buttonsConfig.showConfirmButton = true;
      buttonsConfig.confirmButtonText = '<i class="fa fa-eye-slash"></i> Désactiver Avis';
      buttonsConfig.customClass = buttonsConfig.customClass || {};
      buttonsConfig.customClass.confirmButton = 'btn btn-secondary';
    } else if (showEnableButton) {
      buttonsConfig.showConfirmButton = true;
      buttonsConfig.confirmButtonText = '<i class="fa fa-eye"></i> Activer Avis';
      buttonsConfig.customClass = buttonsConfig.customClass || {};
      buttonsConfig.customClass.confirmButton = 'btn btn-success';
    }

    Swal.fire({
      title: "Détails de l'avis",
      html: `
        <div style='width:100%; max-width: 400px;'>
          <!-- En-tête avec note -->
          <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 10px; margin-bottom: 15px; color: white; text-align: center;'>
            <div style='font-size: 1.3rem; font-weight: bold; margin-bottom: 5px;'>${avi.rate}/5</div>
            <div style='font-size: 0.8rem; opacity: 0.8;'>
              <i class='fa fa-calendar' style='margin-right: 4px;'></i>
              ${this.formatDate(avi.dateReview?.toString())}
            </div>
          </div>

          <!-- Commentaire -->
          <div style='background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 3px solid #007bff;'>
            <div style='display: flex; align-items: center; margin-bottom: 8px;'>
              <i class='fa fa-comment' style='color: #007bff; margin-right: 6px; font-size: 1rem;'></i>
              <span style='font-weight: 600; color: #333; font-size: 0.9rem;'>Commentaire</span>
            </div>
            <div style='color: #555; line-height: 1.5; font-size: 0.9rem; text-align: center;'>
              ${avi.comment || 'Aucun commentaire fourni'}
            </div>
          </div>

          <!-- Informations des utilisateurs -->
          <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;'>
            <!-- Client -->
            <div style='background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 12px; border-radius: 8px; border: 1px solid #e1f5fe;'>
              <div style='display: flex; align-items: center;'>
                <div style='width: 30px; height: 30px; background: #1976d2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 8px;'>
                  <i class='fa fa-user' style='color: white; font-size: 0.8rem;'></i>
                </div>
                <div>
                  <div style='font-weight: 600; color: #1976d2; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.3px;'>Client</div>
                  <div style='font-weight: 500; color: #333; font-size: 0.85rem;'>${avi.clientFullName}</div>
                  ${avi.clientBanned ? '<div style="color: #d32f2f; font-size: 0.7rem; font-weight: 500;"><i class="fa fa-ban"></i> Banni</div>' : ''}
                </div>
              </div>
            </div>

            <!-- Expert -->
            <div style='background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 12px; border-radius: 8px; border: 1px solid #fff8e1;'>
              <div style='display: flex; align-items: center;'>
                <div style='width: 30px; height: 30px; background: #f57c00; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 8px;'>
                  <i class='fa fa-star' style='color: white; font-size: 0.8rem;'></i>
                </div>
                <div>
                  <div style='font-weight: 600; color: #f57c00; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.3px;'>Expert</div>
                  <div style='font-weight: 500; color: #333; font-size: 0.85rem;'>${avi.expertFullName}</div>
                  ${avi.expertBanned ? '<div style="color: #d32f2f; font-size: 0.7rem; font-weight: 500;"><i class="fa fa-ban"></i> Banni</div>' : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- Statut de l'avis -->
          <div style='background: ${avi.enabled ? '#e8f5e8' : '#ffebee'}; padding: 10px; border-radius: 6px; border-left: 3px solid ${avi.enabled ? '#4caf50' : '#f44336'}; margin-bottom: 15px;'>
            <div style='display: flex; align-items: center;'>
              <i class='fa ${avi.enabled ? 'fa-check-circle' : 'fa-times-circle'}' style='color: ${avi.enabled ? '#4caf50' : '#f44336'}; margin-right: 6px; font-size: 0.9rem;'></i>
              <span style='color: ${avi.enabled ? '#2e7d32' : '#c62828'}; font-size: 0.8rem; font-weight: 500;'>
                ${avi.enabled ? 'Avis actif' : 'Avis désactivé'}
              </span>
            </div>
          </div>

          <!-- Note d'information -->
          <div style='background: #e8f5e8; padding: 10px; border-radius: 6px; border-left: 3px solid #4caf50; margin-bottom: 15px;'>
            <div style='display: flex; align-items: center;'>
              <i class='fa fa-info-circle' style='color: #4caf50; margin-right: 6px; font-size: 0.9rem;'></i>
              <span style='color: #2e7d32; font-size: 0.8rem; font-weight: 500;'>
                Vous pouvez bannir le client ou l'expert en cas de comportement inapproprié
              </span>
            </div>
          </div>
        </div>
      `,
      ...buttonsConfig
    }).then((result) => {
      if (result.isDenied && showBanClientButton) {
        this.banClient(avi.clientId);
      } else if (result.dismiss === Swal.DismissReason.cancel && showBanExpertButton) {
        this.banExpert(avi.expertId);
      } else if (result.isConfirmed) {
        if (showDisableButton) {
          this.disableAvis(avi.id);
        } else if (showEnableButton) {
          this.enableAvis(avi.id);
        }
      }
    });
  }

  banClient(clientId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action bannira définitivement le client.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, bannir !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.banUser(clientId).subscribe({
          next: (response) => {
            Swal.fire('Banni', "Le client a été banni.", 'success');
            this.getAvis();
          },
          error: (err) => {
            console.error("Erreur lors du bannissement du client :", err);
            Swal.fire('Erreur', "Erreur lors du bannissement du client.", 'error');
          }
        });
      }
    });
  }

  banExpert(expertId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action bannira définitivement l'expert.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, bannir !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.banUser(expertId).subscribe({
          next: (response) => {
            Swal.fire('Banni', "L'expert a été banni.", 'success');
            this.getAvis();
          },
          error: (err) => {
            console.error("Erreur lors du bannissement de l'expert :", err);
            Swal.fire('Erreur', "Erreur lors du bannissement de l'expert.", 'error');
          }
        });
      }
    });
  }

  disableAvis(avisId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action désactivera l'avis.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6c757d',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, désactiver !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.avisService.disableAvis(avisId).subscribe({
          next: (response) => {
            Swal.fire('Désactivé', "L'avis a été désactivé.", 'success');
            this.getAvis(); // Rafraîchir la liste
          },
          error: (err) => {
            console.error("Erreur lors de la désactivation de l'avis :", err);
            Swal.fire('Erreur', "Erreur lors de la désactivation de l'avis.", 'error');
          }
        });
      }
    });
  }

  enableAvis(avisId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action activera l'avis.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, activer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.avisService.enableAvis(avisId).subscribe({
          next: (response) => {
            Swal.fire('Activé', "L'avis a été activé.", 'success');
            this.getAvis(); // Rafraîchir la liste
          },
          error: (err) => {
            console.error("Erreur lors de l'activation de l'avis :", err);
            Swal.fire('Erreur', "Erreur lors de l'activation de l'avis.", 'error');
          }
        });
      }
    });
  }

}
