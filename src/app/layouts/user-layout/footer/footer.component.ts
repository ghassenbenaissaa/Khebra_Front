import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  socialMedia = [
    {
      icon: 'icofont icofont-social-facebook'
    },
    {
      icon: 'icofont icofont-social-twitter'
    },
    {
      icon: 'icofont icofont-social-behance'
    },
    {
      icon: 'icofont icofont-social-dribble'
    },
    {
      icon: 'icofont icofont-social-linkedin'
    }
  ]
}
