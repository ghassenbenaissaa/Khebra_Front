import { Component, OnInit } from '@angular/core';
import { ExpertService } from '../../../core/services/expert.service';
import { Expert } from '../../../core/models/expert';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgIf, NgFor } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/core/services/user.service';
import { DomaineService } from '../../../core/services/domaine.service';
import { domaineResponse } from '../../../core/models/domaine-response';

@Component({
  selector: 'app-experts',
  standalone: true,
  imports: [CardComponent, NgIf, NgFor],
  templateUrl: './experts.component.html',
  styleUrls: ['./experts.component.scss']
})
export class ExpertsComponent implements OnInit {
  experts: Expert[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  domaines: domaineResponse[] = [];

  constructor(
    private expertService: ExpertService, 
    private userService: UserService,
    private domaineService: DomaineService
  ) {}

  ngOnInit(): void {
    this.getExperts();
    this.getDomaines();
  }

  getExperts(): void {
    this.expertService.getExpertsForAdmin(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.experts = response.content;
        this.totalItems = response.totalElements;
      },
      error: (err) => {
        console.error('Error fetching experts:', err);
      }
    });
  }

  getDomaines(): void {
    this.domaineService.getDomainesForAdmin(0, 100).subscribe({
      next: (response) => {
        this.domaines = response.content;
      },
      error: (err) => {
        console.error('Error fetching domaines:', err);
      }
    });
  }

  get totalPages(): number {
    return this.totalItems > 0 ? Math.ceil(this.totalItems / this.pageSize) : 1;
  }

  onPageChange(event: { pageIndex: number, pageSize: number }): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getExperts();
  }

  openExpertModal(expert: Expert): void {
    if (expert.isBanned) {
      Swal.fire({
        title: "Détails de l'expert",
        html: `
          <div style='display: flex; align-items: flex-start; gap: 24px; min-width: 350px;'>
            <div style='flex-shrink: 0;'>
              <img src='${expert.image?.imageUrl}' alt='Image Expert' style='width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 2px solid #007bff; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'/>
            </div>
            <div style='flex: 1;'>
              <div style='font-size: 1.3rem; font-weight: bold; color: #222;'>${expert.lastname} ${expert.firstname}</div>
              <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-envelope' style='margin-right: 6px; color: #007bff;'></i>${expert.email}</div>
              <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-phone' style='margin-right: 6px; color: #28a745;'></i>${expert.numTel}</div>
              <div style='margin: 10px 0 0 0; color: #888; font-size: 0.95rem;'>${expert.domaineExpertise} | ${expert.expertise}</div>
            </div>
          </div>
          <hr style='margin: 16px 0 12px 0; border: none; border-top: 1px solid #eee;'>
          <div style='width:100%; display: flex; flex-direction: column; gap: 10px; font-size: 1rem;'>
            <div style='display: flex; align-items: flex-start;'>
              <span style='min-width: 110px; color:#007bff; font-weight: 500;'>Adresse :</span>
              <span style='flex:1; word-break: break-word; white-space: pre-line; padding-left: 8px; font-family: "Segoe UI", Arial, sans-serif; text-align: left; display: block;'>${expert.adresse}</span>
            </div>
            <div style='display: flex; align-items: flex-start;'>
              <span style='min-width: 110px; color:#007bff; font-weight: 500;'>CIN :</span>
              <span style='flex:1; white-space: nowrap; overflow-x: auto; text-overflow: ellipsis; padding-left: 8px; font-family: "Segoe UI", Arial, sans-serif; text-align: left; display: block;'>${expert.cin}</span>
            </div>
            <div style='display: flex; align-items: flex-start;'>
              <span style='min-width: 110px; color:#007bff; font-weight: 500;'>Biographie :</span>
              <span style='flex:1; word-break: break-word; white-space: pre-line; padding-left: 8px; font-family: "Segoe UI", Arial, sans-serif; text-align: left; display: block;'>${expert.biographie}</span>
            </div>
          </div>
        `,
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: 'Débannir',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.unbanExpert(expert);
        }
      });
      return;
    }
    // Sinon, logique normale
    Swal.fire({
      title: "Détails de l'expert",
      html: `
        <div style='display: flex; align-items: flex-start; gap: 24px; min-width: 350px;'>
          <div style='flex-shrink: 0;'>
              <img src='${expert.image?.imageUrl || 'https://ui-avatars.com/api/?name=' + (expert.lastname || '') + '+' + (expert.firstname || '')}' alt='Image Expert' style='width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 2px solid #007bff; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'/>
            </div>
          <div style='flex: 1;'>
            <div style='font-size: 1.3rem; font-weight: bold; color: #222;'>${expert.lastname} ${expert.firstname}</div>
            <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-envelope' style='margin-right: 6px; color: #007bff;'></i>${expert.email}</div>
            <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-phone' style='margin-right: 6px; color: #28a745;'></i>${expert.numTel}</div>
            <div style='margin: 10px 0 0 0; color: #888; font-size: 0.95rem;'>${expert.domaineExpertise} | ${expert.expertise}</div>
          </div>
        </div>
        <hr style='margin: 16px 0 12px 0; border: none; border-top: 1px solid #eee;'>
        <div style='width:100%; display: flex; flex-direction: column; gap: 10px; font-size: 1rem;'>
          <div style='display: flex; align-items: flex-start;'>
            <span style='min-width: 110px; color:#007bff; font-weight: 500;'>Adresse :</span>
            <span style='flex:1; word-break: break-word; white-space: pre-line; padding-left: 8px; font-family: "Segoe UI", Arial, sans-serif; text-align: left; display: block;'>${expert.adresse}</span>
          </div>
          <div style='display: flex; align-items: flex-start;'>
            <span style='min-width: 110px; color:#007bff; font-weight: 500;'>CIN :</span>
            <span style='flex:1; white-space: nowrap; overflow-x: auto; text-overflow: ellipsis; padding-left: 8px; font-family: "Segoe UI", Arial, sans-serif; text-align: left; display: block;'>${expert.cin}</span>
          </div>
          <div style='display: flex; align-items: flex-start;'>
            <span style='min-width: 110px; color:#007bff; font-weight: 500;'>Biographie :</span>
            <span style='flex:1; word-break: break-word; white-space: pre-line; padding-left: 8px; font-family: "Segoe UI", Arial, sans-serif; text-align: left; display: block;'>${expert.biographie}</span>
          </div>
        </div>
      `,
      showDenyButton: true,
      showCancelButton: expert.domaineExpertise === 'Autre',
      showConfirmButton: !expert.isValidated,
      showCloseButton: true,
      confirmButtonText: 'Valider',
      denyButtonText: 'Bannir',
      cancelButtonText: 'Modification',
      focusConfirm: false,
      customClass: {
        confirmButton: 'btn btn-success',
        denyButton: 'btn btn-danger',
        cancelButton: 'btn btn-warning'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.validateExpert(expert);
      } else if (result.isDenied) {
        this.banExpert(expert);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.modifyExpert(expert);
      }
    });
  }

  validateExpert(expert: Expert): void {
    this.expertService.validateExpert(expert.id).subscribe({
      next: (response) => {
        console.log('Réponse de validation :', response);
        Swal.fire('Validé !', "L'expert a été validé.", 'success');
        this.getExperts();
      },
      error: (err) => {
        console.error("Erreur lors de la validation de l'expert :", err);
      }
    });
  }

  banExpert(expert: Expert): void {
    this.userService.banUser(expert.id).subscribe({
      next: (response) => {
        console.log('Réponse de validation :', response);
        Swal.fire('Banni', "L'expert a été banni.", 'success');
        this.getExperts();
      },
      error: (err) => {
        console.error("Erreur lors du bannissement de l'expert :", err);
      }
    });
  }
  
  unbanExpert(expert: Expert): void {
    this.userService.unbanUser(expert.id).subscribe({
      next: (response) => {
        console.log('Réponse de validation :', response);
        Swal.fire('Débanni', "L'expert a été débanni.", 'success');
        this.getExperts();
      },
      error: (err) => {
        console.error("Erreur lors du débannissement de l'expert :", err);
      }
    });
  }

  modifyExpert(expert: Expert): void {
    // Créer les options pour le select des domaines
    const domaineOptions = this.domaines.map(domaine => 
      `<option value="${domaine.name}" ${expert.domaineExpertise === domaine.name ? 'selected' : ''}>${domaine.name}</option>`
    ).join('');

    Swal.fire({
      title: "Modifier le domaine d'expertise",
      html: `
        <div style='display: flex; align-items: flex-start; gap: 24px; min-width: 350px; margin-bottom: 20px;'>
          <div style='flex-shrink: 0;'>
            <img src='${expert.image?.imageUrl || 'https://ui-avatars.com/api/?name=' + (expert.lastname || '') + '+' + (expert.firstname || '')}' alt='Image Expert' style='width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 2px solid #007bff; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'/>
          </div>
          <div style='flex: 1;'>
            <div style='font-size: 1.3rem; font-weight: bold; color: #222;'>${expert.lastname} ${expert.firstname}</div>
            <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-envelope' style='margin-right: 6px; color: #007bff;'></i>${expert.email}</div>
            <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-phone' style='margin-right: 6px; color: #28a745;'></i>${expert.numTel}</div>
            <div style='margin: 10px 0 0 0; color: #888; font-size: 0.95rem;'>${expert.domaineExpertise} | ${expert.expertise}</div>
          </div>
        </div>
        <hr style='margin: 16px 0 12px 0; border: none; border-top: 1px solid #eee;'>
        <div style='width:100%; display: flex; flex-direction: column; gap: 10px; font-size: 1rem;'>
          <div style='display: flex; align-items: center;'>
            <span style='min-width: 110px; color:#007bff; font-weight: 500;'>Nouveau domaine :</span>
            <select id="domaine-select" style="flex:1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.95rem; margin-left: 8px;">
              <option value="">Sélectionnez un domaine</option>
              ${domaineOptions}
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonText: 'Annuler',
      focusConfirm: false,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false,
      preConfirm: () => {
        const selectElement = document.getElementById('domaine-select') as HTMLSelectElement;
        const newDomaine = selectElement.value;
        if (!newDomaine) {
          Swal.showValidationMessage('Veuillez sélectionner un domaine');
          return false;
        }
        if (newDomaine === expert.domaineExpertise) {
          Swal.showValidationMessage('Le domaine sélectionné est identique au domaine actuel');
          return false;
        }
        return newDomaine;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.updateExpertDomaine(expert.id, result.value);
      }
    });
  }

  updateExpertDomaine(expertId: number, newDomaine: string): void {
    // Trouver l'ID du domaine correspondant au nom
    const domaine = this.domaines.find(d => d.name === newDomaine);
    if (!domaine) {
      Swal.fire('Erreur', 'Domaine non trouvé', 'error');
      return;
    }

    this.expertService.updateExpert(expertId, domaine.id).subscribe({
      next: (response) => {
        console.log('Réponse de mise à jour :', response);
        Swal.fire('Succès', `Le domaine de l'expert a été modifié vers : ${newDomaine}`, 'success');
        this.getExperts(); // Recharger la liste des experts
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du domaine de l'expert :", err);
        Swal.fire('Erreur', "Erreur lors de la mise à jour du domaine", 'error');
      }
    });
  }

}
