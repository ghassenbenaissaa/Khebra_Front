import { Component, OnInit } from '@angular/core';
import { DomaineService } from 'src/app/core/services/domaine.service';
import { Domaine, Image } from 'src/app/core/models/domaine';
import Swal from 'sweetalert2';
import { ImageService } from 'src/app/core/services/image.service';
import { NgIf, NgFor } from '@angular/common';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { domaineResponse } from 'src/app/core/models/domaine-response';

@Component({
  selector: 'app-domaine',
  standalone: true,
  imports: [NgIf, NgFor, CardComponent],
  templateUrl: './domaine.component.html',
  styleUrl: './domaine.component.scss'
})
export class DomaineComponent implements OnInit {
  domaines: domaineResponse[] = [];

  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  isLoading = false;

  constructor(private domaineService: DomaineService, private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadDomaines();
  }
  
  loadDomaines(): void {
    this.domaineService.getDomainesForAdmin(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.domaines = response.content;
        this.totalItems = response.totalElements;
        console.log(this.domaines);
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
    this.loadDomaines();
  }


  async openAddDomaineModal(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Ajouter un domaine',
      html: `
        <div style='width:100%; display: flex; flex-direction: column; gap: 15px; font-size: 1rem;'>
          <div style='display: flex; align-items: center;'>
            <span style='min-width: 120px; color:#007bff; font-weight: 500;'>Nom du domaine :</span>
            <input id="swal-input1" style="flex:1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.95rem; margin-left: 8px;" placeholder="Ex: Informatique, Médecine, etc.">
          </div>
          <div style='display: flex; align-items: center;'>
            <span style='min-width: 120px; color:#007bff; font-weight: 500;'>Image :</span>
            <input id="swal-input2" type="file" accept="image/*" style="flex:1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem; margin-left: 8px; background: white;">
          </div>
          <div style='background: #e3f2fd; padding: 12px; border-radius: 6px; border-left: 4px solid #2196f3; font-size: 0.85rem; color: #1976d2; margin-top: 10px;'>
            <i class='fa fa-info-circle' style='margin-right: 6px;'></i>
            L'image sera utilisée pour représenter ce domaine d'expertise.
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      focusConfirm: false,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false,
      preConfirm: () => {
        const nom = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const fileInput = document.getElementById('swal-input2') as HTMLInputElement;
        const file = fileInput.files && fileInput.files[0];
        if (!nom.trim()) {
          Swal.showValidationMessage('Veuillez saisir le nom du domaine');
          return null;
        }
        if (!file) {
          Swal.showValidationMessage('Veuillez sélectionner une image');
          return null;
        }
        return { nom: nom.trim(), file };
      }
    });

    if (formValues) {
      Swal.fire({
        title: 'Ajout en cours...',
        text: 'Veuillez patienter pendant l\'upload de l\'image.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      this.imageService.uploadImageAndReturn(formValues.file).subscribe({
        next: (response: Image) => {
          const domaine = {
            id: 0,
            name: formValues.nom,
            image: response // Ici tu envoies l’objet image avec son ID
          };
          this.domaineService.addDomaine(domaine).subscribe({
            next: () => {
              Swal.close();
              Swal.fire('Succès', 'Domaine ajouté', 'success');
              this.loadDomaines();
            },
            error: () => {
              Swal.close();
              Swal.fire('Erreur', 'Erreur lors de l\'ajout', 'error');
            }
          });
        },
        error: () => {
          Swal.close();
          Swal.fire('Erreur', 'Erreur lors de l\'upload de l\'image', 'error');
        }
      });
    }
    
    
  }

  async openEditDomaineModal(domaine: domaineResponse): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Modifier le domaine',
      html: `
        <div style='width:100%; display: flex; flex-direction: column; gap: 15px; font-size: 1rem;'>
          <!-- Image actuelle -->
          ${domaine.imageUrl ? `
            <div style='background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 10px;'>
              <div style='font-size: 0.9rem; color: #28a745; margin-bottom: 8px; font-weight: 500;'>Image actuelle :</div>
              <img src="${domaine.imageUrl}" alt="Image actuelle" style="max-width: 120px; max-height: 80px; object-fit: cover; border-radius: 6px; border: 2px solid #e9ecef;">
            </div>
          ` : ''}
          
          <div style='display: flex; align-items: center;'>
            <span style='min-width: 120px; color:#007bff; font-weight: 500;'>Nom du domaine :</span>
            <input id="swal-input1" style="flex:1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.95rem; margin-left: 8px;" placeholder="Ex: Informatique, Médecine, etc." value="${domaine.name}">
          </div>
          <div style='display: flex; align-items: center;'>
            <span style='min-width: 120px; color:#007bff; font-weight: 500;'>Nouvelle image :</span>
            <input id="swal-input2" type="file" accept="image/*" style="flex:1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem; margin-left: 8px; background: white;">
          </div>
          <div style='background: #fff3cd; padding: 12px; border-radius: 6px; border-left: 4px solid #ffc107; font-size: 0.85rem; color: #856404; margin-top: 10px;'>
            <i class='fa fa-info-circle' style='margin-right: 6px;'></i>
            Laissez vide pour conserver l'image actuelle.
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
        const nom = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const fileInput = document.getElementById('swal-input2') as HTMLInputElement;
        const file = fileInput.files && fileInput.files[0];
        if (!nom.trim()) {
          Swal.showValidationMessage('Veuillez saisir le nom du domaine');
          return null;
        }
        return { nom: nom.trim(), file };
      }
    });
  
    if (formValues) {
      Swal.fire({
        title: 'Modification en cours...',
        text: 'Veuillez patienter.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      const finalUpdate = (image: any) => {
        const domaineToUpdate = {
          id: domaine.id,
          name: formValues.nom,
          image: image ? {
            id: image.id || 0, // 0 pour une nouvelle image
            name: image.name || formValues.file?.name || 'domaine-image',
            imageUrl: image.imageUrl,
            imageId: image.imageId || this.imageService.extractPublicIdFromUrl(image.imageUrl)
          } : null
        };
  
        this.domaineService.updateDomaine(domaineToUpdate).subscribe({
          next: () => {
            Swal.close();
            Swal.fire('Succès', 'Domaine modifié', 'success');
            this.loadDomaines();
          },
          error: (err) => {
            Swal.close();
            console.error('Erreur complète:', err);
            Swal.fire('Erreur', 'Erreur lors de la modification', 'error');
          }
        });
      };
  
      if (formValues.file) {
        // Cas 1: Upload nouvelle image
        this.imageService.uploadImageAndReturn(formValues.file).subscribe({
          next: (uploadedImage: any) => {
            finalUpdate({
              id: 0,
              name: formValues.file.name,
              imageUrl: uploadedImage.imageUrl,
              imageId: this.imageService.extractPublicIdFromUrl(uploadedImage.imageUrl)
            });
          },
          error: (err) => {
            Swal.close();
            console.error('Erreur upload:', err);
            Swal.fire('Erreur', 'Échec de l\'upload de l\'image', 'error');
          }
        });
      } else if (domaine.imageUrl) {
        // Cas 2: Garder l'image existante
        finalUpdate({
          id: domaine.imageId,
          name: 'existing-image',
          imageUrl: domaine.imageUrl,
          imageId: this.imageService.extractPublicIdFromUrl(domaine.imageUrl)
        });
      } else {
        // Cas 3: Pas d'image
        finalUpdate(null);
      }
    }
  }

}
