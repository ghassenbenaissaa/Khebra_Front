import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isSticky: boolean = false;
  logo: string = 'assets/images/logo-white.png';
  private routerSub: Subscription;
  private authSub: Subscription;
  isAuthenticated = false;
  isHomePage = false;



  constructor(private authService: AuthService,  private router: Router) {}

  ngOnInit(): void {
    this.checkCurrentRoute();

    this.authSub = this.authService.authStatus$.subscribe(status => {
      this.isAuthenticated = status;
    });

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/home' ||
                         event.urlAfterRedirects === '/';
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  private checkCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.isHomePage = currentUrl === '/home' || currentUrl === '/';
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollTop > 100) {
      this.isSticky = true;
      this.logo = 'assets/images/logo-black.png';
    } else {
      this.isSticky = false;
      this.logo = 'assets/images/logo-white.png';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }

  isCollapsed = true;
}
