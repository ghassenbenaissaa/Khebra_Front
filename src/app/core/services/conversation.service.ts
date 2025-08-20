import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Conversation} from "../models/conversation";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private baseUrl = 'http://localhost:8088/api/v1/conversation';
  constructor(private http: HttpClient,
  ) {}

  getAllConversation(page: number = 0,
                     size: number = 5): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
    return this.http.get<void>(`${this.baseUrl}/all`, { params });
  }

  GetConversation(conversationId: number): Observable<Conversation> {
    let params = new HttpParams()
      .set('conversationId', conversationId)
    return this.http.get<Conversation>(this.baseUrl, { params });
  }

  updateConversationStatus(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.put<void>(`${this.baseUrl}/status`, null, { params });
  }
  
}
