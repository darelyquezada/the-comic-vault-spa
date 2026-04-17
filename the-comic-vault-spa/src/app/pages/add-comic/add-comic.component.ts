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
  styleUrls: ['./add-comic.component.css'],
})
export class AddComicComponent implements OnInit {
  // Reactive Form
  comicForm!: FormGroup; // Main reactive form group
  isSubmitting = false; // Loading state for the button
  submitSuccess = false; // Shows success message
  submitError = ''; // Holds error messages

  isDragging = false; // Drag & drop state
  imagePreview: string | ArrayBuffer | null = null; // Preview base64 string
  selectedFile: File | null = null; // Store actual File object

  // Options for the dropdown menus
  categories = [
    'Daredevil',
    'Spiderman',
    'Batman',
    'Xmen',
    'Wonderwoman',
    'Invincible',
    'Flash',
    'Thor',
    'Saga',
    'Captainamerica',
    'Aquaman',
  ];
  brands = ['MARVEL', 'DC', 'IMAGE'];

  constructor(
    private fb: FormBuilder,
    private comicService: ComicService,
    private router: Router,
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
      is_available: [true],
    });
  }

  // Easy access to form controls from HTML
  get f() {
    return this.comicForm.controls;
  }

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

    // Function to handle database save after URL is locked in
    const saveComic = (finalImageUrl: string) => {
      const data = {
        ...this.comicForm.value,
        price: parseFloat(this.comicForm.value.price),
        stock: parseInt(this.comicForm.value.stock, 10),
        image_url: finalImageUrl
      };

      this.comicService.addComic(data).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          setTimeout(() => this.router.navigate(['/catalog']), 2500);
        },
        error: () => {
          this.isSubmitting = false;
          this.submitError = 'An error occurred. Please try again.';
        },
      });
    };

    // If an image was provided, upload it first
    if (this.selectedFile) {
      this.comicService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          saveComic(response.filename);
        },
        error: () => {
          this.isSubmitting = false;
          this.submitError = 'Failed to upload the image file to the server.';
        }
      });
    } else {
      // Fallback if somehow there's no file provided
      saveComic(this.comicForm.value.image_url);
    }
  }

  // Clear form and reset to defaults
  onReset(): void {
    this.comicForm.reset({ is_available: true });
    this.submitError = '';
    this.imagePreview = null;
    this.selectedFile = null;
  }

  // Drag and drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.handleFile(event.target.files[0]);
    }
  }

  handleFile(file: File) {
    if (!file.type.match(/image\/*/)) {
      this.submitError = 'Only images can be added as a cover.';
      return;
    }

    // Keep the file
    this.selectedFile = file;

    // We assume the DB takes the filename and the image will be placed in assets
    this.comicForm.patchValue({ image_url: file.name });
    this.comicForm.get('image_url')?.markAsTouched();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(event: Event, fileInput: HTMLInputElement) {
    event.stopPropagation();
    this.imagePreview = null;
    this.selectedFile = null;
    this.comicForm.patchValue({ image_url: '' });
    fileInput.value = '';
  }
}
