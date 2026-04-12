import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // Ruta 'inicio'
  { path: '**', redirectTo: '', pathMatch: 'full' } // Ruta para manejar rutas no definidas
];