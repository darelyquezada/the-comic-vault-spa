import { Component, OnInit, signal, input, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComicService } from '../../services/comic.service';
import { CartService } from '../../services/cart.service';
import { Comic } from '../../models/comic.model';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  // Input signal to get the :id from the URL automatically
  // This needs withComponentInputBinding() in app.config.ts
  id = input.required<string>();

  // Signals to manage the loading state and comic data
  comic = signal<Comic | undefined>(undefined);
  isLoading = signal(true);
  addedToCart = signal(false);

  // Computed signal to check if this comic is already in the cart
  isInCart = computed(() => {
    const currentComic = this.comic();
    return currentComic ? this.cartService.isInCart(currentComic.id) : false;
  });

  constructor(
    public comicService: ComicService, // public so the HTML template can access it
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Convert the string ID from the URL to a number
    const comicId = Number(this.id());
    
    // Fetch the specific comic details using the service
    this.comicService.getComicById(comicId).subscribe({
      next: (data) => { 
        this.comic.set(data); // Update the comic signal with received data
        this.isLoading.set(false); // Stop the loading spinner
      },
      error: () => { 
        this.isLoading.set(false); // Stop loading even if there is an error
      }
    });
  }

  // Adds the current comic to the shopping cart
  onAddToCart(): void {
    const currentComic = this.comic();
    if (currentComic) {
      this.cartService.addToCart(currentComic); // Use the service method to add comic to cart
      this.addedToCart.set(true); // Triggers the success message
    }
  }

  // Returns a specific CSS class based on the publisher
  getBrandClass(): string {
    const b = this.comic()?.brand?.toLowerCase();
    if (b === 'marvel') return 'badge-marvel';
    if (b === 'dc') return 'badge-dc';
    if (b === 'image') return 'badge-image';
    return 'badge-default';
  }
}