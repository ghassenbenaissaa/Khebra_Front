import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './layouts/admin-layout/admin.component';
import { GuestComponent } from './layouts/guest-layout/guest.component';
import {PublicLayoutComponent} from "./layouts/user-layout/public-layout.component";
import {HomeComponent} from "./features/front/home/home.component";
import {ExpertComponent} from "./features/front/experts/expert.component";
import {CountersComponent} from "./features/front/counters/counters.component";
import {ComingSoonComponent} from "./features/front/coming-soon/coming-soon.component";
import {ErrorComponent} from "./features/front/error/error.component";
import {ProfileComponent} from "./features/front/profile/profile.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {DemandeCommunicationComponent} from "./features/front/demande-communication/demande-communication.component";
import { ExpertDetailsComponent } from './features/front/expert-details/expert-details.component';
import {RoleGuard} from "./core/guards/role.guard";



const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      { path: 'home', component: HomeComponent },
      { path: 'experts', component: ExpertComponent },
      { path: 'counters', component: CountersComponent },
      { path: 'coming-soon', component: ComingSoonComponent },
      { path : 'profile', component: ProfileComponent, canActivate: [AuthGuard,RoleGuard], data: {roles:['[ROLE_CLIENT]','[ROLE_EXPERT]']} },
      { path : 'demande-communication', component : DemandeCommunicationComponent, canActivate: [AuthGuard,RoleGuard], data: {roles:['[ROLE_CLIENT]','[ROLE_EXPERT]']} },
      { path : 'expertDetails', component: ExpertDetailsComponent}
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard,RoleGuard],
    data: { roles: ['[ROLE_ADMIN]'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component'),
      },
      {
        path: 'basic',
        loadChildren: () =>
          import('./features/admin/ui-elements/ui-basic/ui-basic.module').then(
            (m) => m.UiBasicModule,
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./features/admin/form-elements/form-elements.module').then(
            (m) => m.FormElementsModule,
          ),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./features/admin/tables/tables.module').then(
            (m) => m.TablesModule,
          ),
      },
      {
        path: 'apexchart',
        loadComponent: () =>
          import('./features/admin/chart/apex-chart/apex-chart.component'),
      },
      {
        path: 'sample-page',
        loadComponent: () =>
          import('./features/admin/extra/sample-page/sample-page.component'),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/users/users.component').then((m)=>m.UsersComponent),
      },
      {
        path: 'experts',
        loadComponent: () =>
          import('./features/admin/experts/experts.component').then((m)=>m.ExpertsComponent),
      },
      {
        path: 'domaines',
        loadComponent: () =>
          import('./features/admin/domaine/domaine.component').then((m)=>m.DomaineComponent),
      },
      {
        path: 'avis',
        loadComponent: () =>
          import('./features/admin/avis/avis.component').then((m)=>m.AvisComponent),
      },
    ],
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/authentication/authentication.module').then(
            (m) => m.AuthenticationModule,
          ),
      },
    ],
  },
  {path: '**', component: ErrorComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
