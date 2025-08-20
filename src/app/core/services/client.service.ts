import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:8088/api/v1/client';
  constructor(private http: HttpClient)  { }


  getClients(page: number = 0, size: number = 10): Observable<any> {
    const url = `${this.baseUrl}/all`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(url, { params });
  }
}


