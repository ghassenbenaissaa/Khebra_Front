import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-basic-button',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './basic-button.component.html',
  styleUrls: ['./basic-button.component.scss'],
})
export default class BasicButtonComponent {}
