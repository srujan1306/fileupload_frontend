import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

const API = 'http://localhost:3000';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, ReactiveFormsModule, NgFor],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // Fixed typo from styleUrl to styleUrls
})
export class AppComponent {
  courseForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private router: Router, private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      file: [null],
    });
  }

  // Handle file input change
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      console.error('No image file selected.');
      return;
    }

    // Create a new FormData object
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Perform the fetch request
    fetch(`${API}/upload`, {
      method: 'POST',
      body: formData, // Set FormData as the body
      // Do not set Content-Type header manually; let the browser handle it
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then((data) => {
        // Handle the response data
        console.log('Upload successful:', data);
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error uploading image:', error);
      });
  }
}
