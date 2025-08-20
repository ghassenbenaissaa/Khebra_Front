import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRoles: string[] = route.data['roles'];
    return this.authService.userRole$.pipe(
      map(userRole => {
        const allowed = expectedRoles.includes(userRole);
        if (!allowed) {
          this.router.navigate(['/']);
        }
        return allowed;
      })
    );
  }
}
