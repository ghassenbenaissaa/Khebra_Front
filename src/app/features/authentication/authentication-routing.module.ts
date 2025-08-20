import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./auth-signin/auth-signin.component'),
      },
      {
        path: 'signup',
        loadComponent: () => import('./auth-signup/auth-signup.component'),
      },
      {
        path: 'type',
        loadComponent: () => import('./auth-type/auth-type.component').then(m => m.AuthTypeComponent),
      }
      ,
       {
        path: 'activate-account',
        loadComponent: () => import('./auth-activate-account/auth-activate-account.component')
        .then(m => m.AuthActivateAccountComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./auth-reset-password/auth-reset-password.component'),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./auth-forgot-password/auth-forgot-password.component'),
      },
      {
        path: 'banned',
        loadComponent: () => import('./banned/banned.component').then(m => m.BannedComponent),
      },
      { path: 'not-activated', 
        loadComponent: () => import('./not-activated/not-activated.component').then(m => m.NotActivatedComponent) 
      },
      {
        path: 'expert-not-validated',
        loadComponent: () => import('./expert-not-validated/expert-not-validated.component').then(m => m.ExpertNotValidatedComponent)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
