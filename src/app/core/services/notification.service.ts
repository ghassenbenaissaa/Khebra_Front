import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8088/api/v1/notification'; // adjust as needed

  constructor(private http: HttpClient) {
  }

  getNotifications(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<any>(`${this.baseUrl}/getAll`, {params});
  }
}
