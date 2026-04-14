import { Comic } from './comic.model';

export interface CartItem {
  comic: Comic;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
