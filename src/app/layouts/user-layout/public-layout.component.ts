import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {
  title = 'Khebra';
  showFooter = true;
  isProfilePage = false;
  isDemande = false;
  isConnected: boolean = false;



  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects; // more robust than event.url

        this.showFooter = !(url === '/error' || url === '/coming-soon');

        this.isProfilePage = url.startsWith('/profile');
        this.isDemande = url.endsWith('/demande-communication');
        this.isConnected = !!localStorage.getItem('token');
      }
    });
  }


  ngOnInit(): void {
    this.loadStyle('assets/css/master.css');
    this.loadStyle('assets/css/responsive.css');
    this.loadFont('https://fonts.googleapis.com/css?family=Montserrat:400,500,700|Open+Sans:400,600|Raleway:100,200,300,400');
  }

  private loadStyle(href: string): void {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(document.head, link);
  }
  private loadFont(href: string): void {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(document.head, link);
  }
}
