import { Injectable } from '@angular/core';
import { RegistrationRequest } from '../models/registration-request';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { AuthenticationRequest } from '../models/authentication-request';
import { AuthenticationResponse } from '../models/authentication-response';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8088/api/v1/auth';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.authStatus.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient,
             ) {}

  // Register new user
  register(data: RegistrationRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, data);
  }
  // Activate user account by token
  activateAccount(token: string): Observable<void> {
    const params = new HttpParams().set('token', token);
    return this.http.get<void>(`${this.baseUrl}/activate-account`, { params });
  }
  //set IsAuthenticated to true only when user is logged in successfully
  login(data: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((res) => {
        this.authStatus.next(true);
          this.userRoleSubject.next(res.role);})
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, { email });
  }

// Reset password with token
  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, { token, newPassword });
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.authStatus.value;
  }
  logout() {
    localStorage.clear();
    this.authStatus.next(false);
  }
  ResendValidationEmail(email: string): Observable<void> {
    const params = new HttpParams().set('email', email);
    // POST with empty body and query params in options
    return this.http.post<void>(`${this.baseUrl}/send-validation-email`, null, { params });
  }

  refreshToken(refreshToken: string): Observable<AuthenticationResponse> {
    const params = new HttpParams().set('refreshToken', refreshToken);
    return this.http.post<AuthenticationResponse>(
      `${this.baseUrl}/refresh-token`,
      null, // No body
      { params, headers: new HttpHeaders({ 'Skip-Auth': 'true' }) }
    );
  }


}
