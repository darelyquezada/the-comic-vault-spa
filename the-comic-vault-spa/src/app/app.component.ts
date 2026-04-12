import { Routes } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    RouterOutlet,    
    NavbarComponent, 
    FooterComponent  
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'the-comic-vault-spa';
}


