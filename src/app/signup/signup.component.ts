import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']  // Corrected styleUrls
})
export class SignupComponent {
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  message = '';


  constructor(private router: Router) {}
  async signup() {
    if (this.signupForm.invalid) {
      this.message = 'Please fill out the form correctly.';
      return;
    }
  
    const { email, username, password } = this.signupForm.value as {
      email: string;
      username: string;
      password: string;
    };
  
    console.log('Sending data:', { email, username, password });
  
    try {
      const response = await axios.post('https://back-end-finals.onrender.com/signup', { email, username, password });
      this.message = 'Signup successful!';
      console.log('Response:', response);
      this.router.navigate([`/login`]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this.message = 'Error: ' + error.response.data.error;
        console.log('Error', error.response.data);
      } else {
        this.message = 'An unexpected error occurred';
        console.error('Unexpected error', error);
      }
    }
  }
}