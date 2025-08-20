  import { Component } from '@angular/core';
import {CardComponent} from "../../../shared/components/card/card.component";
import {DemandeCommunication} from "../../../core/models/demandecommunication";
import {DemandecommunicationService} from "../../../core/services/demandecommunication.service";
import {DatePipe, NgForOf, CommonModule} from "@angular/common";
import Swal from 'sweetalert2';
import { ConversationService } from 'src/app/core/services/conversation.service';
import { AvisService } from 'src/app/core/services/avis.service';
import { AvisRequest } from 'src/app/core/models/avis-request';

  @Component({
    selector: 'app-demande-communication',
    standalone: true,
    imports: [
      CardComponent,
      NgForOf,
      DatePipe,
      CommonModule
    ],
    templateUrl: './demande-communication.component.html',
    styleUrl: './demande-communication.component.scss'
  })
  export class DemandeCommunicationComponent {
  demandes: DemandeCommunication[] = [];
  isClient: boolean = false;
  isExpert: boolean = false;

  constructor( private demandeService: DemandecommunicationService, private conversationService: ConversationService, private avisService: AvisService){}

  ngOnInit(): void {
    this.detectUserRole();
    this.loadDemandes();
  }

  detectUserRole(): void {
    const roles = localStorage.getItem('role');

    if (roles) {
      const normalizedRoles = roles.toUpperCase();
      this.isClient = normalizedRoles.includes('ROLE_CLIENT');
      this.isExpert = normalizedRoles.includes('ROLE_EXPERT');
    } else {
      this.isClient = false;
      this.isExpert = false;
    }
  }

    loadDemandes() {
      if (this.isClient) {
        this.loadClientDemandes();
      } else if (this.isExpert) {
        this.loadExpertDemandes();
      }
    }

    loadClientDemandes() {
      this.demandeService.getDemandes()
        .subscribe({
          next: (data) => {
            this.demandes = data;
          },
          error: (err) => {
            console.error('Failed to load client demandes', err);
            this.demandes = [];
          }
        });
    }

    loadExpertDemandes() {
      this.demandeService.getDemandesExpert()
        .subscribe({
          next: (data) => {
            this.demandes = data;
          },
          error: (err) => {
            console.error('Failed to load expert demandes', err);
            this.demandes = [];
          }
        });
    }

    getStatusLabel(status: string): string {
      switch (status) {
        case 'EN_ATTENTE':
          return 'En attente';
        case 'ACCEPTEE':
          return 'Acceptée';
        case 'REFUSEE':
          return 'Refusée';
        case 'ACHEVÉE':
          return 'Achevée';
        case 'COMMENTÉE':
          return 'Commentée';
        default:
          return status;
      }
    }

    getTruncatedMessage(message: string): string {
      if (message && message.length > 100) {
        return message.substring(0, 100) + '...';
      }
      return message;
    }

    deleteDemande(demande: DemandeCommunication) {
      if (demande.status !== 'EN_ATTENTE') {
        return;
      }

      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Voulez-vous vraiment supprimer cette demande ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          this.demandeService.DeleteDemandeCommunication({
            expertEmail: demande.expertEmail,
            status: demande.status
          }).subscribe({
            next: () => {
              this.demandes = this.demandes.filter(d => d !== demande);
              Swal.fire('Supprimé!', 'Demande supprimée avec succès.', 'success');
            },
            error: err => {
              console.error(err);
              Swal.fire('Erreur', 'Échec de la suppression de la demande.', 'error');
            }
          });
        }
      });
    }

    showDetails(demande: DemandeCommunication) {
      const isEnAttente = demande.status === 'EN_ATTENTE';
      const isAcceptee = demande.status === 'ACCEPTEE';
      const isAchevee = demande.status === 'ACHEVÉE';
      const isExpert = this.isExpert;
      const isClient = this.isClient;

      Swal.fire({
        title: '<strong>Détails de la Demande</strong>',
        html: `
          <div class="demande-details">
            <!-- Header avec statut -->
            <div class="status-header">
              <div class="status-badge">
                <span class="badge badge-${this.getStatusBadgeClass(demande.status)}">
                  ${this.getStatusLabel(demande.status)}
                </span>
              </div>
            </div>

            <!-- Informations principales -->
            <div class="info-section">
              <div class="info-row">
                <div class="info-item">
                  <i class="fas fa-envelope"></i>
                  <div class="info-content">
                    <label>Email Expert</label>
                    <span>${demande.expertEmail}</span>
                  </div>
                </div>
                <div class="info-item">
                  <i class="fas fa-calendar-alt"></i>
                  <div class="info-content">
                    <label>Date de Demande</label>
                    <span>${new Date(demande.timestamp).toLocaleString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message -->
            <div class="message-section">
              <label class="message-label">
                <i class="fas fa-comment"></i>
                Message
              </label>
              <div class="message-content">
                <p>${demande.message}</p>
              </div>
            </div>
          </div>
        `,
        showCloseButton: true,
        showConfirmButton: (isExpert && isEnAttente) || (isClient && isEnAttente) || (isExpert && isAcceptee) || (isClient && isAchevee),
        showDenyButton: isExpert && isEnAttente,
        showCancelButton: (!isExpert || !isEnAttente) && !(isExpert && isAcceptee) && !(isClient && isAchevee),
        confirmButtonText: isExpert && isAcceptee ? 'Clôturer la discussion' : (isExpert ? 'Accepter' : (isClient && isAchevee ? 'Ajouter un avis' : 'Supprimer')),
        denyButtonText: 'Refuser',
        cancelButtonText: 'Fermer',
        confirmButtonColor: isExpert && isAcceptee ? '#fd7e14' : (isExpert ? '#28a745' : (isClient && isAchevee ? '#17a2b8' : '#dc3545')),
        denyButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        width: '700px',
        customClass: {
          popup: 'swal2-custom-popup',
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-html'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          if (isExpert && isAcceptee) {
            this.cloturerDiscussion(demande);
          } else if (isExpert) {
            this.accepterDemande(demande);
          } else if (isClient && isAchevee) {
            this.ajouterAvis(demande);
          } else {
            this.deleteDemande(demande);
          }
        } else if (result.isDenied) {
          this.refuserDemande(demande);
        }
      });
    }

    cloturerDiscussion(demande: DemandeCommunication) {
      Swal.fire({
        title: 'Clôturer la discussion',
        text: 'Êtes-vous sûr de vouloir clôturer cette discussion ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, clôturer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#fd7e14'
      }).then((result) => {
        if (result.isConfirmed) {
          this.conversationService.updateConversationStatus(demande.conversationId).subscribe({
            next: () => {
              Swal.fire(
                'Discussion clôturée',
                'La discussion a été clôturée avec succès.',
                'success'
              );
              this.ngOnInit();
            },
            error: (err) => {
              Swal.fire(
                'Erreur',
                'Une erreur est survenue lors de la clôture de la discussion.',
                'error'
              );
              console.error(err);
            }
          });
        }
      });
    }


    getStatusBadgeClass(status: string): string {
      switch (status) {
        case 'EN_ATTENTE':
          return 'warning';
        case 'ACCEPTEE':
          return 'success';
        case 'REFUSEE':
          return 'danger';
        case 'ACHEVÉE':
          return 'success';
        case 'COMMENTÉE':
          return 'info';
        default:
          return 'secondary';
      }
    }

    accepterDemande(demande: DemandeCommunication) {
      Swal.fire({
        title: 'Confirmation',
        text: 'Êtes-vous sûr de vouloir accepter cette demande ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Oui, accepter',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.demandeService.updateDemandeStatus(demande.id, 'ACCEPTEE').subscribe({
            next: () => {
              Swal.fire(
                'Acceptée!',
                'La demande a été acceptée avec succès.',
                'success'
              );
              this.ngOnInit();
            },
            error: () => {
              Swal.fire(
                'Erreur!',
                'Une erreur est survenue lors de l\'acceptation.',
                'error'
              );
            }
          });
        }
      });
    }

    refuserDemande(demande: DemandeCommunication) {
      Swal.fire({
        title: 'Confirmation',
        text: 'Êtes-vous sûr de vouloir refuser cette demande ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Oui, refuser',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.demandeService.updateDemandeStatus(demande.id, 'REFUSEE').subscribe({
            next: () => {
              Swal.fire(
                'Refusée!',
                'La demande a été refusée.',
                'info'
              );
              this.ngOnInit();
            },
            error: () => {
              Swal.fire(
                'Erreur!',
                'Une erreur est survenue lors du refus.',
                'error'
              );
            }
          });
        }
      });
    }

    ajouterAvis(demande: DemandeCommunication) {
      Swal.fire({
        title: 'Évaluer l\'expert',
        html: `
          <div class="avis-form">
            <div class="rating-section">
              <label class="rating-label">Note globale :</label>
              <div class="stars">
                <i class="far fa-star" data-rating="1"></i>
                <i class="far fa-star" data-rating="2"></i>
                <i class="far fa-star" data-rating="3"></i>
                <i class="far fa-star" data-rating="4"></i>
                <i class="far fa-star" data-rating="5"></i>
              </div>
            </div>
            <div class="comment-section">
              <label class="comment-label">Commentaire :</label>
              <textarea id="avis-comment" class="form-control" rows="4" placeholder="Partagez votre expérience avec cet expert..."></textarea>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Envoyer l\'avis',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#17a2b8',
        cancelButtonColor: '#6c757d',
        width: '600px',
        customClass: {
          popup: 'swal2-custom-popup',
          title: 'swal2-custom-title',
          htmlContainer: 'swal2-custom-html'
        },
        didOpen: () => {
          // Gestion des étoiles interactives
          const stars = document.querySelectorAll('.stars i');
          let selectedRating = 0;

          // Fonction pour mettre à jour l'affichage des étoiles
          const updateStars = (rating: number) => {
            stars.forEach((star, index) => {
              if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
              } else {
                star.classList.remove('fas');
                star.classList.add('far');
              }
            });
          };

          stars.forEach((star, index) => {
            // Clic pour sélectionner
            star.addEventListener('click', () => {
              selectedRating = index + 1;
              updateStars(selectedRating);
            });

            // Hover pour prévisualiser
            star.addEventListener('mouseenter', () => {
              const hoverRating = index + 1;
              updateStars(hoverRating);
            });
          });

          // Réinitialiser à la sélection quand on quitte la zone
          document.querySelector('.stars')?.addEventListener('mouseleave', () => {
            updateStars(selectedRating);
          });
        },
        preConfirm: () => {
          const rating = document.querySelectorAll('.stars i.fas').length;
          const comment = (document.getElementById('avis-comment') as HTMLTextAreaElement).value;

          if (rating === 0) {
            Swal.showValidationMessage('Veuillez donner une note à l\'expert');
            return false;
          }

          return { rating, comment };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { rating, comment } = result.value;

        
          const avisRequest: AvisRequest = {
            demandeId: demande.id,
            rating,
            comment
          };
        
          this.avisService.addAvis(avisRequest).subscribe({
            next: () => {
              Swal.fire({
                title: 'Avis envoyé !',
                text: 'Merci pour votre évaluation. Votre avis a été enregistré avec succès.',
                icon: 'success',
                confirmButtonColor: '#17a2b8'
              });
              this.ngOnInit();
            },
            error: (error) => {
              const message = error.error || "Une erreur est survenue lors de l'envoi de votre avis.";
              Swal.fire({
                title: 'Erreur',
                text: message,
                icon: 'error',
                confirmButtonColor: '#dc3545'
              });
              console.error(error);
            }
            
          });

        }
        
      });
    }

  }
