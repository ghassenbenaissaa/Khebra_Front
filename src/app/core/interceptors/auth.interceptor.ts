import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from "../services/auth.service";
import {AuthenticationResponse} from "../models/authentication-response";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');
    let authReq = req;
    if (req.headers.has('Skip-Auth')) {
      return next.handle(req.clone({ headers: req.headers.delete('Skip-Auth') }));
    }
    if (token) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('[AuthInterceptor] Request error:', error);

        if (
          error.status === 401 &&
          error.error?.businessErrorDescription === 'Token expired, please refresh your token'
        ) {
          console.warn('[AuthInterceptor] Token expired — attempting refresh.');
          return this.handle401Error(authReq, next);
        }

        console.warn('[AuthInterceptor] Not a token expiry — rethrowing error.');
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        return throwError(() => new Error('No refresh token available'));
      }

      return this.authService.refreshToken(refreshToken).pipe(
        switchMap((response: AuthenticationResponse) => {
          this.isRefreshing = false;

          // Save new tokens to localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);

          this.refreshTokenSubject.next(response.token);

          return next.handle(this.addTokenHeader(request, response.token));
        }),
        catchError(err => {
          console.error('[AuthInterceptor] Refresh token request failed:', err);
          this.isRefreshing = false;
          // Optionally: clear storage, logout user here
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addTokenHeader(request, token!));
        })
      );
    }
  }

}
