import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Avis} from "../models/avis";
import { AvisRequest } from '../models/avis-request';

@Injectable({
  providedIn: 'root'
})
export class AvisService {

  private baseUrl = 'http://localhost:8088/api/v1/avis';
  constructor(private http: HttpClient)  { }

  getAvis(id:number):Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.baseUrl}/getAll?expertId=${id}`);
  }

  addAvis(avisRequest: AvisRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/add`, avisRequest);
  }
  
  getAllAvisPaged(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all?page=${page}&size=${size}`);
  }

  disableAvis(avisId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/disable?avisId=${avisId}`, {});
  }

  enableAvis(avisId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/enable?avisId=${avisId}`, {});
  }
  
}
