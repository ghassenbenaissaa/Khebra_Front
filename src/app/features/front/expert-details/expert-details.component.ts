import {Component, EventEmitter, Input, OnInit, Output, NgZone} from '@angular/core';
import { Expert } from '../../../core/models/expert';
import {DemandecommunicationService} from "../../../core/services/demandecommunication.service";
import {AvisService} from "../../../core/services/avis.service";
import {Avis} from "../../../core/models/avis";
import {ExpertService} from "../../../core/services/expert.service";
import { AuthService } from "../../../core/services/auth.service";
import { Router, NavigationEnd } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-expert-details',
  templateUrl: './expert-details.component.html',
  styleUrls: ['./expert-details.component.css']
})
export class ExpertDetailsComponent implements OnInit {

  constructor(
    private demandecommunicationService: DemandecommunicationService,
    private avisService: AvisService,
    private expertService: ExpertService,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone // Ajout de NgZone
  ) {
    // S'abonner aux événements de navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ngZone.run(() => {
          this.reloadExpert();
        });
      }
    });
  }
  showPopup = false;
  demandeMessage = '';
  avis : Avis[]=[];
  showFull: { [index: number]: boolean } = {};
  expert: Expert = {} as Expert;
  experts: Expert[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';
  isAuthenticated = false;

  ngOnInit(): void {
    this.reloadExpert();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  reloadExpert() {
    const email = localStorage.getItem('selectedExpertEmail');
    if (email) {
      this.expertService.getExpertByEmail(email).subscribe(data => {
        this.expert = data;
        this.loadAvis();
        this.loadExperts();
      });
    }
  }
  loadAvis(){
    this.avisService.getAvis(this.expert.id).subscribe({
      next :(data) => {
        this.avis=data;}
      });
  }

  sendDemande() {
    if (!this.demandeMessage.trim()) {
      this.showAlert('info', 'Message vide', 'Veuillez entrer un message avant d\'envoyer.');
      return;
    }

    this.demandecommunicationService.createDemandeCommunication({
      expertEmail: this.expert.email,
      message: this.demandeMessage.trim()
    }).subscribe({
      next: () => {
        this.demandeMessage = '';
        this.showPopup = false;
        this.showAlert('success', 'Demande envoyée', 'Votre demande de communication a été envoyée avec succès !');
      },
      error: (err) => {
        console.error('Request failed:', err);

        if (err.status === 409) {
          this.showAlert('warning', 'Demande déjà envoyée', 'Vous avez déjà une demande en attente avec cet expert.');
        } else if (err.status === 404) {
          this.showAlert('error', 'Expert introuvable', 'Cet expert est introuvable.');
        } else {
          this.showAlert('error', 'Erreur', 'Une erreur est survenue. Veuillez réessayer plus tard.');
        }
      }
    });
  }



  toggleShow(index: number, event: Event): void {
    event.preventDefault();
    this.showFull[index] = !this.showFull[index];
  }


  viewProfile(expert: Expert) {
    localStorage.setItem('selectedExpertEmail', expert.email);
    this.router.navigate(['/expertDetails']);
  }



  loadExperts(): void {
    this.isLoading = true;

    // Only using the current expert's domain and expertise
    const domain = this.expert.domaineExpertise || null;

    this.expertService.getExperts(
      0,               // first page
      3,   // keep current pagination size
      domain,
      null,            // region
      null,            // minRating
      null,
    ).subscribe({
      next: (data) => {
        this.experts = data.content;
        this.isLoading = false;

        if (this.experts.length === 0) {
          this.showError('No similar experts found.');
        }
      },
      error: (err) => {
        console.error('Request failed:', err);

        if (err.status === 409) {
          this.showAlert('warning', 'Demande déjà envoyée', 'Vous avez déjà une demande en attente avec cet expert.');
        } else if (err.status === 404) {
          this.showAlert('error', 'Expert introuvable', 'Cet expert est introuvable.');
        } else {
          this.showAlert('error', 'Erreur', 'Une erreur est survenue. Veuillez réessayer plus tard.');
        }
      }
    });
  }
  showError(message: string) {
    this.errorMessage = message;

    setTimeout(() => {
      this.errorMessage = '';
    }, 4000);
  }
  private showAlert(icon: 'success' | 'error' | 'warning' | 'info', title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'OK'
    });
  }

}
