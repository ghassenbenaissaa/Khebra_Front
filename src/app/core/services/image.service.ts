import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Image} from "../models/image";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://localhost:8088/api/v1/image';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  uploadImageAndReturn(file: File): Observable<Image> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<Image>(`${this.baseUrl}/upload-and-get`, formData);
  }
  
  extractPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }
  
}
