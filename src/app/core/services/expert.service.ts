import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ExpertService {
  private baseUrl = 'http://localhost:8088/api/v1/expert';
  constructor(private http: HttpClient)  { }


  getExperts(
    page: number = 0,
    size: number = 10,
    domain?: string,
    minRating?: number,
    maxRating?: number,
    lat?: number,
    lng?: number,
    radiusKm?: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (domain && domain.trim()) {
      params = params.set('domainName', domain.trim());
    }

    if (minRating !== undefined && minRating !== null) {
      params = params.set('minRating', minRating.toString());
    }

    if (maxRating !== undefined && maxRating !== null) {
      params = params.set('maxRating', maxRating.toString());
    }

    if (lat !== undefined && lat !== null) {
      params = params.set('lat', lat.toString());
    }

    if (lng !== undefined && lng !== null) {
      params = params.set('lng', lng.toString());
    }

    if (radiusKm !== undefined && radiusKm !== null) {
      params = params.set('radiusKm', radiusKm.toString());
    }

    return this.http.get<any>(this.baseUrl, { params });
  }


  getExpertsForAdmin(page: number = 0, size: number = 10): Observable<any> {
    const url = `${this.baseUrl}/admin`;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());


    return this.http.get<any>(url, { params });
  }

  validateExpert(expertId: number): Observable<any> {
    const url = `${this.baseUrl}/validation/${expertId}`;
    return this.http.post<any>(url, {});
  }

  updateExpert(userId: number, domaineId: number): Observable<any> {
    const url = `${this.baseUrl}/update`;

    const body = new HttpParams()
      .set('userId', userId.toString())
      .set('domaineId', domaineId.toString());
    return this.http.post<any>(url, body.toString());
  }

  getExpertByEmail(email: string): Observable<any> {
    const url = `${this.baseUrl}/email`;
    return this.http.post<any>(url, { email });
  }




}
