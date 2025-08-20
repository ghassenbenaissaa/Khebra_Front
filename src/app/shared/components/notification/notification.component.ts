import { Component, OnDestroy } from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import { WebSocketService } from "../../../core/services/web-socket.service";
import { NotificationService } from "../../../core/services/notification.service";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DatePipe
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnDestroy {
  displayedNotifications: any[] = [];
  currentPage: number = 0;
  pageSize: number = 3;
  totalPages: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';
  showToast: boolean = false;
  private notificationSub: any;


  constructor(
    private notificationService: NotificationService,
    private websocketService: WebSocketService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    this.websocketService.connect();
    this.loadNotifications(this.currentPage);
    this.notificationSub = this.websocketService.notificationReceived
      .subscribe((newNotif: any) => {
      this.toastr.info(newNotif.message );
       this.reloadNotifications();


    });
  }

  ngOnDestroy(): void {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
    // Optionally disconnect the websocket if you want to close it when the component is destroyed:
    this.websocketService.disconnect();
  }

  loadNotifications(page: number): void {
    this.isLoading = true;
    this.notificationService.getNotifications(page, this.pageSize).subscribe({
      next: (data: any) => {
        // Append or set notifications
        if (page === 0) {
          this.displayedNotifications = data.content;
        } else {
          this.displayedNotifications = [...this.displayedNotifications, ...data.content];
        }

        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.isLoading = false;

        if (!data.content || data.content.length === 0) {
          this.showError('No notifications found.');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showError('Failed to load notifications.');
      }
    });
  }

  reloadNotifications(): void {
    this.currentPage = 0;
    this.loadNotifications(this.currentPage);
  }

  loadMore(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadNotifications(this.currentPage + 1);
    }
  }

  get hasMore(): boolean {
    return this.currentPage + 1 < this.totalPages;
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
