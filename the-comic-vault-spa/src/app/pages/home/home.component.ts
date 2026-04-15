import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ComicCardComponent } from '../../components/comic-card/comic-card.component';
import { MovieSectionComponent } from '../../components/movie-section/movie-section.component'
import { ComicService } from '../../services/comic.service';
import { CartService } from '../../services/cart.service';
import { ContactService } from '../../services/contact.service';
import { Comic } from '../../models/comic.model';

// Interface for the contact section data
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, ComicCardComponent, MovieSectionComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredComics: Comic[] = []; // Array for the top comics section
  isLoading = true; // Loading spinner state
  messageSent = false; // Flag for contact success message

  // Object to use with the Template Form
  contactForm: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(
    private comicService: ComicService, // For comic data
    private cartService: CartService, // For cart data
    private contactService: ContactService, // For contact message
    private router: Router // For navigation to details page
  ) {}

  ngOnInit(): void {
    // Show only the featured comics on load
    this.comicService.getFeaturedComics().subscribe({
      next: (comics) => { 
        this.featuredComics = comics; // Set featured comics
        this.isLoading = false; // Hide loading icon
      },
      error: () => { this.isLoading = false; } // Hide loading icon even if there's an error
    });
  }

  // Check if a comic is already in the cart to update the button
  isInCart(comic: Comic): boolean { return this.cartService.isInCart(comic.id); }

  // Add item to cart using the service
  onAddToCart(comic: Comic): void { this.cartService.addToCart(comic); }

  // Navigate to the specific comic page
  onViewDetail(comic: Comic): void { 
    this.router.navigate(['/details', comic.id]); // Fixed route to match app.routes.ts
  }

  // Handles the contact form submission
  onSubmitContact(form: NgForm): void {
    if (form.valid) {
      // Call the service to save the message in the db
      this.contactService.sendMessage(this.contactForm).subscribe({
        next: (response) => {
          console.log('Message saved successfully', response);
          this.messageSent = true; // Show confirmation to the user
          form.resetForm();
          this.contactForm = { name: '', email: '', subject: '', message: '' };
          
          setTimeout(() => { this.messageSent = false; }, 5000);
        },
        error: (err) => {
          console.error('Error saving message', err);
        }
      });
    }
  }
}