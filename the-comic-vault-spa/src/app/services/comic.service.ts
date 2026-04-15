import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Comic } from '../models/comic.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ComicService { // Temporal array to simulate backend data
  /* private comics: Comic[] = [
    {
      id: 1,
      title: 'Daredevil (2026) #1',
      category: 'Daredevil',
      brand: 'MARVEL',
      writer: 'Saladin Ahmed',
      artist: 'Aaron Kuder',
      price: 4.99,
      stock: 30,
      image_url: 'https://i.annihil.us/u/prod/marvel/i/mg/9/80/5ba3d0869f505/portrait_incredible.jpg',
      description: 'The Man Without Fear returns! Matt Murdock faces a new threat rising in Hell\'s Kitchen that tests everything he holds dear. A bold new chapter begins for Daredevil in this unmissable first issue!',
      is_available: true,
      release_date: '2026-01-15'
    },
    {
      id: 2,
      title: 'Amazing Spider-Man #950',
      category: 'Spiderman',
      brand: 'MARVEL',
      writer: 'Zeb Wells',
      artist: 'John Romita Jr.',
      price: 5.99,
      stock: 25,
      image_url: 'https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b/portrait_incredible.jpg',
      description: 'A landmark issue! Peter Parker confronts the consequences of his choices as the web of his life becomes more tangled than ever. Featuring a shocking revelation that will change Spider-Man forever!',
      is_available: true,
      release_date: '2026-02-05'
    },
    {
      id: 3,
      title: 'Batman: Dark City #1',
      category: 'Batman',
      brand: 'DC',
      writer: 'Tom King',
      artist: 'Greg Capullo',
      price: 4.99,
      stock: 20,
      image_url: 'https://m.media-amazon.com/images/I/51m1MV2m2oL._AC_SY580_.jpg',
      description: 'Gotham is burning from within, and only the Dark Knight stands between order and total chaos. Tom King and Greg Capullo reunite for the definitive Batman story of the decade.',
      is_available: true,
      release_date: '2026-01-22'
    },
    {
      id: 4,
      title: 'X-Men: Krakoa Rising #3',
      category: 'Xmen',
      brand: 'MARVEL',
      writer: 'Gerry Duggan',
      artist: 'Pepe Larraz',
      price: 4.99,
      stock: 18,
      image_url: 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_incredible.jpg',
      description: 'The X-Men face their greatest challenge as Krakoa\'s future hangs in the balance. Mutantkind must stand united or fall divided in this pivotal third chapter.',
      is_available: true,
      release_date: '2026-02-12'
    },
    {
      id: 5,
      title: 'Wonder Woman: Themyscira #5',
      category: 'Wonderwoman',
      brand: 'DC',
      writer: 'Kelly Thompson',
      artist: 'Jesus Merino',
      price: 3.99,
      stock: 15,
      image_url: 'https://m.media-amazon.com/images/I/61pCBnKRRRL._AC_SY580_.jpg',
      description: 'Diana returns to the shores of Themyscira to face a reckoning with her past. Kelly Thompson delivers a masterful tale of gods, heroes, and the price of immortality.',
      is_available: true,
      release_date: '2026-01-29'
    },
    {
      id: 6,
      title: 'Invincible #150',
      category: 'Invincible',
      brand: 'IMAGE',
      writer: 'Robert Kirkman',
      artist: 'Ryan Ottley',
      price: 6.99,
      stock: 12,
      image_url: 'https://m.media-amazon.com/images/I/71GnXy4BQTL._AC_SY580_.jpg',
      description: 'The landmark 150th issue! Mark Grayson\'s journey reaches a stunning new milestone. Kirkman and Ottley pull out all the stops for this unforgettable chapter of the Invincible saga.',
      is_available: true,
      release_date: '2026-03-01'
    },
    {
      id: 7,
      title: 'The Flash: Speed Force #2',
      category: 'Flash',
      brand: 'DC',
      writer: 'Jeremy Adams',
      artist: 'Fernando Pasarin',
      price: 3.99,
      stock: 22,
      image_url: 'https://m.media-amazon.com/images/I/71kBaeLZZcL._AC_SY580_.jpg',
      description: 'Barry Allen races against time itself as a new threat to the Speed Force emerges. Jeremy Adams continues his acclaimed run with breathtaking action and heart.',
      is_available: true,
      release_date: '2026-02-19'
    },
    {
      id: 8,
      title: 'Thor: God of Thunder #88',
      category: 'Thor',
      brand: 'MARVEL',
      writer: 'Jason Aaron',
      artist: 'Esad Ribic',
      price: 4.99,
      stock: 17,
      image_url: 'https://i.annihil.us/u/prod/marvel/i/mg/5/a0/537bca1a52426/portrait_incredible.jpg',
      description: 'The God of Thunder faces Gorr the God Butcher once more in a rematch that will shake the heavens! Jason Aaron returns to the story that defined modern Thor mythology.',
      is_available: true,
      release_date: '2026-01-08'
    },
    {
      id: 9,
      title: 'Saga #70',
      category: 'Saga',
      brand: 'IMAGE',
      writer: 'Brian K. Vaughan',
      artist: 'Fiona Staples',
      price: 3.99,
      stock: 28,
      image_url: 'https://m.media-amazon.com/images/I/81VxB7J3hxL._AC_SY580_.jpg',
      description: 'Hazel\'s story continues in the most beloved science-fantasy epic in comics. BKV and Fiona Staples deliver another extraordinary chapter of the galaxy\'s most unlikely family.',
      is_available: true,
      release_date: '2026-03-15'
    },
    {
      id: 10,
      title: 'Captain America #750',
      category: 'Captainamerica',
      brand: 'MARVEL',
      writer: 'Ta-Nehisi Coates',
      artist: 'Leinil Francis Yu',
      price: 7.99,
      stock: 10,
      image_url: 'https://i.annihil.us/u/prod/marvel/i/mg/3/20/5232158de5b16/portrait_incredible.jpg',
      description: 'A GIANT-SIZED 750th issue spectacular! Steve Rogers faces a threat that challenges the very ideal of America. Featuring backup stories from Marvel\'s greatest creators celebrating the Sentinel of Liberty.',
      is_available: true,
      release_date: '2026-04-04'
    },
    {
      id: 11,
      title: 'Aquaman: Trench War #1',
      category: 'Aquaman',
      brand: 'DC',
      writer: 'Brandon Thomas',
      artist: 'Daniel Sampere',
      price: 3.99,
      stock: 14,
      image_url: 'https://m.media-amazon.com/images/I/71mwqNJLlAL._AC_SY580_.jpg',
      description: 'Arthur Curry dives into the deep end as ancient terrors resurface from the Mariana Trench. Brandon Thomas launches an explosive new era for the King of Atlantis.',
      is_available: true,
      release_date: '2026-02-26'
    },
    {
      id: 12,
      title: 'Spider-Man: Miles Morales #25',
      category: 'Spiderman',
      brand: 'MARVEL',
      writer: 'Saladin Ahmed',
      artist: 'Carmen Carnero',
      price: 4.99,
      stock: 19,
      image_url: 'https://i.annihil.us/u/prod/marvel/i/mg/f/30/5261a6a7b96a7/portrait_incredible.jpg',
      description: 'Miles Morales hits a major milestone as Brooklyn\'s Spider-Man faces his greatest test yet. A perfect jumping-on point featuring guest appearances from across the Marvel Universe.',
      is_available: true,
      release_date: '2026-03-22'
    }
  ]; */

  private apiUrl = `${environment.apiUrl}/api/comics`;

  constructor(private http: HttpClient) {}

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
