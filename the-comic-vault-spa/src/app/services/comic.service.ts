import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Comic } from '../models/comic.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ComicService {
  // Use API URL from environment
  private apiUrl = `${environment.apiUrl}/api/comics`;

  constructor(private http: HttpClient) {} // Inject HttpClient for making API calls

  // Returns the full list of comics
  getComics(): Observable<Comic[]> {
    return this.http.get<Comic[]>(this.apiUrl);
  }

  // Finds a comic by its ID number
  getComicById(id: number): Observable<Comic | undefined> {
    return this.http.get<Comic>(`${this.apiUrl}/${id}`);
  }

  // Adds a new comic to the list and gives it an ID
  addComic(comic: Omit<Comic, 'id'>): Observable<Comic> {
    return this.http.post<Comic>(this.apiUrl, comic);
  }

  // Gets the first 6 comics to show them on the home page
  getFeaturedComics(): Observable<Comic[]> {
    return this.http.get<Comic[]>(`${this.apiUrl}/featured`);
  }
}
