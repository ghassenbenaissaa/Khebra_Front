import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Domaine } from '../models/domaine';
import { domaineResponse } from '../models/domaine-response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DomaineService {
  private baseUrl = 'http://localhost:8088/api/v1/domaine';
  constructor(private http: HttpClient)  { }

  getDomaines(): Observable<Domaine> {
    return this.http.get<Domaine>(`${this.baseUrl}/all`);
  }

  getDomainesSignUp(): Observable<Domaine> {
    return this.http.get<Domaine>(`${this.baseUrl}/signup/all`);
  }
  
  getDomainesForAdmin(page: number = 0, size: number = 10): Observable<{content: domaineResponse[], totalElements: number}> {
    const url = `${this.baseUrl}/admin`;
    const token = localStorage.getItem('token');
  
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

  
    return this.http.get<any>(url, { params }).pipe(
      map((response: any) => ({
        ...response,
        content: response.content.map((domaine: any) => ({
          id: domaine.id,
          name: domaine.name,
          imageUrl: domaine.imageUrl ?? domaine.image?.imageUrl ?? ''
        }))
      }))
    );
  }

  addDomaine(domaine: Domaine): Observable<Domaine> {
    return this.http.post<Domaine>(`${this.baseUrl}/add`, domaine);
  }
  updateDomaine(domaine: Domaine): Observable<Domaine> {
    return this.http.put<Domaine>(`${this.baseUrl}/update`, domaine);
  }
  deleteDomaine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
  getDomaineById(id: number): Observable<Domaine> {
    return this.http.get<Domaine>(`${this.baseUrl}/get/${id}`);
  }
}
