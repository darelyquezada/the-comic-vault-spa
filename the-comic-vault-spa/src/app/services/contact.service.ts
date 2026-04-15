import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Use the API URL 
  private apiUrl = `${environment.apiUrl}/api/messages`;

  constructor(private http: HttpClient) { }

  // Send the contact message to the backend 
  sendMessage(messageData: any): Observable<any> {
    return this.http.post(this.apiUrl, messageData);
  }
}