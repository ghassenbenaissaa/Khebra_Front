import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { recommendationRequest } from '../models/recommendation-request';
import { expertOut } from '../models/expert-response';




@Injectable({
  providedIn: 'root'
})
export class FastAPIService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  recommendExperts(request: recommendationRequest): Observable<expertOut[]> {
    return this.http.post<expertOut[]>(`${this.apiUrl}/recommend`, request);
  }
}
