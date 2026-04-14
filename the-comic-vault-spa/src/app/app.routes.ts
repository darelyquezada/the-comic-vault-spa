import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { DetailComponent } from './pages/detail/detail.component';
import { AddComicComponent } from './pages/add-comic/add-comic.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // 'home' route as the default route
  { path: 'home', component: HomeComponent, title: 'The Comic Vault - Home' }, // 'home' route for HomeComponent
  { path: 'catalog', component: CatalogComponent, title: 'Catalog - The Comic Vault' },
  { path: 'details/:id', component: DetailComponent, title: 'Comic Detail - The Comic Vault' },
  { path: 'add-comic', component: AddComicComponent, title: 'Add Comic - The Comic Vault' },
  { path: 'cart', component: CartComponent, title: 'Cart - The Comic Vault' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' } // Route to catch all undefined paths and redirect to home
];
