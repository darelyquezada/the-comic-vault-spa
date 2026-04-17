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

  // Add a new comic to the database
  addComic(comic: Comic): Observable<any> {
    return this.http.post<any>(this.apiUrl, comic);
  }

  // Upload an image file to the backend
  uploadImage(file: File): Observable<{ success: boolean; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ success: boolean; filename: string }>(`${this.apiUrl.replace('/comics', '/upload')}`, formData);
  }

  // Gets the first 6 comics to show them on the home page
  getFeaturedComics(): Observable<Comic[]> {
    return this.http.get<Comic[]>(`${this.apiUrl}/featured`);
  }
}
