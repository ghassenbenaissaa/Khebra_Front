// angular import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// project import
import { CardComponent } from './components/card/card.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FloatingMessengerComponent } from './components/floating-messenger/floating-messenger.component';
import {NgApexchartsModule} from "ng-apexcharts";

// bootstrap import
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// third party
import { NgScrollbarModule } from 'ngx-scrollbar';
import {DonutChartComponent} from "./components/donut-chart/donut-chart.component";

@NgModule({
  declarations: [SpinnerComponent,
    DonutChartComponent,
    FloatingMessengerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbModule,
    NgScrollbarModule,
    NgbCollapseModule,
    BreadcrumbsComponent,
    NgApexchartsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    SpinnerComponent,
    NgbModule,
    NgScrollbarModule,
    NgbCollapseModule,
    BreadcrumbsComponent,
    DonutChartComponent,
    FloatingMessengerComponent

  ],
})
export class SharedModule {}
