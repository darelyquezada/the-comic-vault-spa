import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ComicService } from '../../services/comic.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  // Connect service signals to the component
  items = this.cartService.items;
  total = this.cartService.total;
  itemCount = this.cartService.itemCount;
  isEmpty = this.cartService.isEmpty;

  constructor(
    private cartService: CartService,
    public comicService: ComicService 
  ) {}

  // Changes quantity using the plus/minus buttons
  updateQuantity(item: CartItem, delta: number): void {
    this.cartService.updateQuantity(item.comic.id, item.quantity + delta);
  }

  // Deletes a single item from the list
  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.comic.id);
  }

  // Empty the whole cart at once
  clearCart(): void {
    this.cartService.clearCart();
  }
}