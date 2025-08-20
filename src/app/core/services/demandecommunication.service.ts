import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StatusDemande} from "../models/demandecommunication";

@Injectable({
  providedIn: 'root'
})
export class DemandecommunicationService {

  private baseUrl = 'http://localhost:8088/api/v1/demande-communication';
  constructor(private http: HttpClient)  { }

  getDemandes(): Observable<any> {
    const url = `${this.baseUrl}/`;
    return this.http.get(url);
  }

  getDemandesExpert(): Observable<any> {
    const url = `${this.baseUrl}/expert`;
    return this.http.get(url);
  }

  createDemandeCommunication(payload: { expertEmail: string; message: string }): Observable<any> {
    const url = `${this.baseUrl}/`;
    return this.http.post(url, payload);
  }

  DeleteDemandeCommunication(payload: { expertEmail: string; status: StatusDemande }): Observable<any> {
    const url = `${this.baseUrl}/`;
    return this.http.delete(url,{ body: payload }); // bad idea keep it for now
  }
  getCountsDemande(id:number):Observable<any> {
    const url = `${this.baseUrl}/`;
    return this.http.get(url+'status-counts?id='+id);
  }

  updateDemandeStatus(id: number, status: StatusDemande): Observable<any> {
    const url = `${this.baseUrl}/status`;
    return this.http.put(url, null, {
      params: {
        id: id.toString(),
        status: status
      }
    });
  }
  
}
