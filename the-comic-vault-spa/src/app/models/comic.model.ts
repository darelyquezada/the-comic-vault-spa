export interface Comic {
  id: number;
  title: string;
  category: string;
  brand: string;
  writer: string;
  artist: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  is_available: boolean;
  release_date: string;
}
