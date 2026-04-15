import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = 'efa820b1'; 
  private apiUrl = `https://www.omdbapi.com/?apikey=${this.apiKey}`;

  constructor(private http: HttpClient) { }

  // Search by title 
  getMovieByTitle(title: string): Observable<any> {
    // encodeURIComponent to handle spaces in the URL
    return this.http.get(`${this.apiUrl}&t=${encodeURIComponent(title)}`);
  }
}