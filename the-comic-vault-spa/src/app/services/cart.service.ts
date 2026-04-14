import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Comic } from '../models/comic.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Private list to manage the cart state
  private _items = signal<CartItem[]>([]); // Internal signal 

  // Readonly version for components to use
  readonly items = this._items.asReadonly(); // This allows components to read but not directly modify the cart items

  // Calculates total number of items in cart
  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  // Calculates the total price to pay
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.comic.price * item.quantity, 0)
  );

  // Checks if the cart is empty
  readonly isEmpty = computed(() => this._items().length === 0);

  // Adds a comic or increases quantity if already there
  addToCart(comic: Comic): void {
    const currentItems = this._items();
    const existingIndex = currentItems.findIndex(i => i.comic.id === comic.id);

    if (existingIndex >= 0) {
      // If it exists, update only that specific item
      const updated = [...currentItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1
      };
      this._items.set(updated);
    } else {
      // Add new comic to the array with quantity 1
      this._items.set([...currentItems, { comic, quantity: 1 }]);
    }
  }

  // Removes a comic using its ID
  removeFromCart(comicId: number): void {
    this._items.set(this._items().filter(i => i.comic.id !== comicId));
  }

  // Updates quantity for a specific item
  updateQuantity(comicId: number, quantity: number): void {
    if (quantity <= 0) {
      // Remove item if quantity drops to 0
      this.removeFromCart(comicId);
      return;
    }
    
    // Map through the array to update the right item
    const updated = this._items().map(item =>
      item.comic.id === comicId ? { ...item, quantity } : item
    );
    this._items.set(updated); // Update the signal with the new array
  }

  // Clears everything from the cart
  clearCart(): void {
    this._items.set([]);
  }

  // Checks if a comic is already in the cart
  isInCart(comicId: number): boolean {
    return this._items().some(i => i.comic.id === comicId);
  }
}