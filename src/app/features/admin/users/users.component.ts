import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/core/services/client.service';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { NgFor } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CardComponent, NgFor],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  clients: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(private clientService: ClientService, private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.clientService.getClients(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.clients = response.content;
        this.totalItems = response.totalElements;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
      }
    });
  }

  get totalPages(): number {
    return this.totalItems > 0 ? Math.ceil(this.totalItems / this.pageSize) : 1;
  }

  onPageChange(event: { pageIndex: number, pageSize: number }): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getUsers();
  }

  openUserModal(client: any): void {
    // Si l'utilisateur est banni, on affiche uniquement le bouton "Débannir"
    if (client.isBanned) {
      Swal.fire({
        title: "Détails de l'utilisateur",
        html: `
          <div style='display: flex; align-items: flex-start; gap: 24px; min-width: 350px;'>
            <div style='flex-shrink: 0;'>
              <img src='${client.image?.imageUrl || 'https://ui-avatars.com/api/?name=' + (client.lastname || '') + '+' + (client.firstname || '')}' alt='Image Utilisateur' style='width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 2px solid #007bff; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'/>
            </div>
            <div style='flex: 1;'>
              <div style='font-size: 1.3rem; font-weight: bold; color: #222;'>${client.lastname} ${client.firstname}</div>
              <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-envelope' style='margin-right: 6px; color: #007bff;'></i>${client.email}</div>
              <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-phone' style='margin-right: 6px; color: #28a745;'></i>${client.numTel || ''}</div>
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
          this.unbanUser(client);
        }
      });
      return;
    }
    // Sinon, logique normale
    Swal.fire({
      title: "Détails de l'utilisateur",
      html: `
        <div style='display: flex; align-items: flex-start; gap: 24px; min-width: 350px;'>
          <div style='flex-shrink: 0;'>
            <img src='${client.image?.imageUrl || 'https://ui-avatars.com/api/?name=' + (client.lastname || '') + '+' + (client.firstname || '')}' alt='Image Utilisateur' style='width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 2px solid #007bff; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'/>
          </div>
          <div style='flex: 1;'>
            <div style='font-size: 1.3rem; font-weight: bold; color: #222;'>${client.lastname} ${client.firstname}</div>
            <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-envelope' style='margin-right: 6px; color: #007bff;'></i>${client.email}</div>
            <div style='color: #555; margin: 4px 0 0 0;'><i class='fa fa-phone' style='margin-right: 6px; color: #28a745;'></i>${client.numTel || ''}</div>
          </div>
        </div>
      `,
      showDenyButton: true,
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: true,
      denyButtonText: 'Bannir',
      customClass: {
        denyButton: 'btn btn-danger',
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isDenied) {
        this.banUser(client);
      }
    });
  }

  banUser(client: any): void {
    this.userService.banUser(client.id).subscribe({
      next: (response) => {
        Swal.fire('Banni', "L'utilisateur a été banni.", 'success');
        this.getUsers();
      },
      error: (err) => {
        console.error("Erreur lors du bannissement de l'utilisateur :", err);
      }
    });
  }

  unbanUser(client: any): void {
    this.userService.unbanUser(client.id).subscribe({
      next: (response) => {
        Swal.fire('Débanni', "L'utilisateur a été débanni.", 'success');
        this.getUsers();
      },
      error: (err) => {
        console.error("Erreur lors du débannissement de l'utilisateur :", err);
      }
    });
  }
}
