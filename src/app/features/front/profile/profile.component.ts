import {Component, OnInit, Output} from '@angular/core';
import {User} from "../../../core/models/user";
import {UserService} from "../../../core/services/user.service";
import {HttpEventType} from "@angular/common/http";
import {ImageService} from "../../../core/services/image.service";
import {BehaviorSubject} from "rxjs";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {


  user!: User;
  userRole?: string;
  isEditing = false;
  editableUser!: User;
  uploadProgress: number = 0;
  currentImageUrl: string = '';
  imageUrl$ = new BehaviorSubject<string>('');
  errorMessage = '';
  constructor(
    private userService: UserService,
    private imageService: ImageService,
  ) {
  }

  ngOnInit(): void {
    this.loadUser();

  }

  loadUser(): void {
    if (this.user == null){
      this.userService.userDetails().subscribe(user => {
        this.user = user;

        // Initialize the image URL properly
        if (this.user?.image?.imageUrl) {
          this.currentImageUrl = this.user.image.imageUrl;
          this.imageUrl$.next(this.currentImageUrl); // Update BehaviorSubject
        }

      });
    }
  }

  enableEdit() {
    this.isEditing = true;
    this.editableUser = {...this.user}; // shallow copy for safe editing
  }

  saveChanges() {
    this.userService.updateUser(this.editableUser).subscribe(updatedUser => {
      this.user = updatedUser;
      this.isEditing = false;
    }, error => {
      console.error('Error updating user:', error);
    });
  }

  discardChanges() {
    this.isEditing = false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadProgress = 0;

      // Show SweetAlert loading
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while we upload your image.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.imageService.uploadImage(file).subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            // Reset progress
            this.uploadProgress = 0;
            Swal.close(); // close loading popup

            const response = event.body;
            if (response && response.url) {
              this.currentImageUrl = response.url;
              this.onImageUpdated(response.url);

              // Show success popup
              Swal.fire({
                icon: 'success',
                title: 'Upload complete',
                text: 'Your image has been successfully uploaded!'
              });
            }
          }
        },
        error: (err) => {
          this.uploadProgress = 0;

          const backendMsg =
            err?.error?.businessErrorDescription ||
            err?.error?.error ||
            (typeof err?.error === 'string' ? err.error : null);
          if (err.status === 413) {
            const max = err.headers?.get('X-Max-File-Size') || '10MB';
            Swal.fire({
              icon: 'error',
              title: 'File too large',
              text: `Please upload an image smaller than ${max}.`,
            });
            return;
          }

          Swal.fire({
            icon: 'error',
            title: 'Upload failed',
            text: backendMsg || 'Something went wrong. Please try again.',
          });
        }

      });
    }
  }


  onImageUpdated(newImageUrl: string) {
    // Update BehaviorSubject with cache-busting parameter
    this.imageUrl$.next(`${newImageUrl}?v=${Date.now()}`);

  }


}
