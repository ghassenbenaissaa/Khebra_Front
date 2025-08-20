import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {User} from "../../../../core/models/user";
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
})
export class NavRightComponent {
  user!: User;
  currentImageUrl: string = '';
  imageUrl$ = new BehaviorSubject<string>('');
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUser();

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
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

}
