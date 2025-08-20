import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8088/api/v1/user';


  constructor(private http: HttpClient) {}

  userDetails(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/profile`);
  }

  updateUser( user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/profile`, user);
  }

  banUser(userId: number): Observable<any> {
    const url = `${this.baseUrl}/ban/${userId}`;
    const token = localStorage.getItem('token');
    return this.http.post<any>(url, {});
  }

  unbanUser(userId: number): Observable<any> {
    const url = `${this.baseUrl}/unban/${userId}`;
    const token = localStorage.getItem('token');
    return this.http.post<any>(url, {});
  }
}
