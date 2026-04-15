import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-section',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './movie-section.component.html',
  styleUrls: ['./movie-section.component.css']
})
export class MovieSectionComponent implements OnInit {
  movie: any = null;
  isLoading = true;

  // Movie list 
  private featuredMovies: string[] = [
    'Avengers: Endgame',
    'The Batman',
    'Spider-Man: No Way Home',
    'Guardians of the Galaxy',
    'Joker',
    'Deadpool',
    'Watchmen'
  ];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadRandomMovie();
  }

  loadRandomMovie(): void {
    this.isLoading = true;
    
    // Select random movie title from the featuredMovies array
    const randomIndex = Math.floor(Math.random() * this.featuredMovies.length);
    const selectedTitle = this.featuredMovies[randomIndex];

    // Fetch movie data from the service
    this.movieService.getMovieByTitle(selectedTitle).subscribe({
      next: (data) => {
        if (data && data.Response === 'True') {
          this.movie = data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching movie:', err);
        this.isLoading = false;
      }
    });
  }
}