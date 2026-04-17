import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComicService } from '../../services/comic.service';
import { Comic } from '../../models/comic.model';

@Component({
  selector: 'app-comic-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './comic-card.component.html',
  styleUrls: ['./comic-card.component.css']
})
export class ComicCardComponent {
  @Input() comic!: Comic; // Input Property to receive comic data
  @Input() inCart: boolean = false; // Input Property to indicate if the comic is in the cart

  @Output() addToCart = new EventEmitter<Comic>(); // Output Event to notify parent component when adding to cart
  @Output() viewDetail = new EventEmitter<Comic>(); // Output Event to notify parent component when 'View Details' is clicked

  // Inject the service as public to access it in the HTML
  constructor(public comicService: ComicService) {}

  onAddToCart(event: Event): void {
    event.stopPropagation(); // Prevent card click event when clicking 'Add to Cart' button
    this.addToCart.emit(this.comic); // Emit the comic data to the parent component
  }

  onViewDetail(): void {
    this.viewDetail.emit(this.comic); // Emit the comic data to the parent component when 'View Details' is clicked
  }

  getBrandClass(): string {
    const brand = this.comic.brand?.toLowerCase(); // Get the brand in lowercase for comparison
    
    // Return the corresponding CSS class based on the comic brand
    if (brand === 'marvel') return 'badge-marvel';
    if (brand === 'dc') return 'badge-dc';
    if (brand === 'image') return 'badge-image';
    return 'badge-default'; // Default class if brand doesn't match
  }
}