import { Component, OnInit, signal, computed } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComicCardComponent } from '../../components/comic-card/comic-card.component';
import { ComicService } from '../../services/comic.service';
import { CartService } from '../../services/cart.service';
import { Comic } from '../../models/comic.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, ComicCardComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  // Using Signals to handle the state of the catalog
  allComics = signal<Comic[]>([]); // Holds the full list from the service
  searchQuery = signal<string>(''); // Current text in the search bar
  selectedBrand = signal<string>(''); // Filter for Marvel, DC, etc.
  selectedCategory = signal<string>(''); // Filter for specific characters
  
  isLoading = true; // Shows a icon while data loads

  // Static lists for the filter buttons
  brands: string[] = ['MARVEL', 'DC'];
  categories: string[] = ['Daredevil','Spiderman','Dexter'];

  // This computed signal updates itself whenever any filter changes
  filteredComics = computed(() => {
    let result = [...this.allComics()]; // Get the current value of allComics

    // Apply search filter (title, writer or category)
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.writer.toLowerCase().includes(query) || 
        c.category.toLowerCase().includes(query)
      );
    }

    // Filter by brand if one is selected
    if (this.selectedBrand()) {
      result = result.filter(c => c.brand === this.selectedBrand());
    }

    // Filter by category if one is selected
    if (this.selectedCategory()) {
      result = result.filter(c => c.category === this.selectedCategory());
    }

    return result;
  });

  constructor(
    private comicService: ComicService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load comics from the service and save the into the signal
    this.comicService.getComics().subscribe({
      next: (comics) => { 
        this.allComics.set(comics); // Save data into the signal
        this.isLoading = false; 
      },
      error: () => { this.isLoading = false; }
    });
  }

  // Logic to select or deselect a brand filter
  toggleBrand(brand: string): void { 
    this.selectedBrand.set(this.selectedBrand() === brand ? '' : brand); 
  }

  // Logic to select or deselect a category filter
  toggleCategory(cat: string): void { 
    this.selectedCategory.set(this.selectedCategory() === cat ? '' : cat); 
  }

  // This method is called by the search input
  onSearch(): void { 
    // No manual filtering needed because computed() handles it automatically
  }

  // Resets all filters
  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedBrand.set('');
    this.selectedCategory.set('');
  }

  // Interactions with the cart service
  isInCart(comic: Comic): boolean { return this.cartService.isInCart(comic.id); }
  onAddToCart(comic: Comic): void { this.cartService.addToCart(comic); }

  // Go to the details page of the selected comic
  onViewDetail(comic: Comic): void { 
    this.router.navigate(['/details', comic.id]); // Using /details route from app.routes
  }
}