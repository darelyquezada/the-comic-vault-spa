import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { ComicCardComponent } from '../../components/comic-card/comic-card.component';
import { ComicService } from '../../services/comic.service';
import { CartService } from '../../services/cart.service';
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
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, ComicCardComponent],
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
      this.messageSent = true; // Show success message
      form.resetForm(); // Clear the form fields
      this.contactForm = { name: '', email: '', subject: '', message: '' };
      
      // Hide the success message after 5 seconds
      setTimeout(() => { this.messageSent = false; }, 5000);
    }
  }
}