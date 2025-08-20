import { Injectable } from '@angular/core';
import {Message} from "../models/message";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = 'http://localhost:8088/api/v1/message';

  constructor(private http: HttpClient) {}

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.baseUrl, message);
  }
}
