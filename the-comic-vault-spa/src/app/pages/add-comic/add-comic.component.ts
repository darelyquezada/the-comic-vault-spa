import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComicService } from '../../services/comic.service';

@Component({
  selector: 'app-add-comic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-comic.component.html',
  styleUrls: ['./add-comic.component.css']
})
export class AddComicComponent implements OnInit { // Reactive Form
  comicForm!: FormGroup; // Main reactive form group
  isSubmitting = false; // Loading state for the button
  submitSuccess = false; // Shows success message
  submitError = ''; // Holds error messages

  // Options for the dropdown menus
  categories = ['Daredevil','Spiderman','Batman','Xmen','Wonderwoman','Invincible','Flash','Thor','Saga','Captainamerica','Aquaman'];
  brands = ['MARVEL', 'DC', 'IMAGE'];

  constructor(
    private fb: FormBuilder,
    private comicService: ComicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize form with validation rules
    this.comicForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      writer: ['', Validators.required],
      artist: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01), Validators.max(99.99)]],
      stock: ['', [Validators.required, Validators.min(0), Validators.max(9999)]],
      release_date: ['', Validators.required],
      image_url: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      is_available: [true]
    });
  }

  // Easy access to form controls from HTML
  get f() { return this.comicForm.controls; }

  // Check if a specific field has errors to show red borders
  isFieldInvalid(field: string): boolean {
    const ctrl = this.comicForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit(): void {
    // Stop if the form is not valid
    if (this.comicForm.invalid) {
      this.comicForm.markAllAsTouched(); // Show all errors
      return;
    }
    
    this.isSubmitting = true;
    this.submitError = '';

    // Format data before sending to service
    const data = {
      ...this.comicForm.value,
      price: parseFloat(this.comicForm.value.price),
      stock: parseInt(this.comicForm.value.stock, 10)
    };

    // Send data to the backend
    this.comicService.addComic(data).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        // Go back to catalog after a short delay
        setTimeout(() => this.router.navigate(['/catalog']), 2500);
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = 'An error occurred. Please try again.';
      }
    });
  }

  // Clear form and reset to defaults
  onReset(): void {
    this.comicForm.reset({ is_available: true });
    this.submitError = '';
  }
}