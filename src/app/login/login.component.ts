import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userLogin = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });


  message = '';
  constructor(private router: Router) {}

  async login() {
    if (this.userLogin.invalid) {
      this.message = 'Please fill out the form correctly.';
      return;
    }

    const { email, password } = this.userLogin.value;


    try {
      const response = await axios.post('https://back-end-finals.onrender.com/login', { email, password });
      const { id, email: userEmail, username } = response.data;
      this.message = 'Login successful!';
      
      if (username) {
        this.router.navigate([`/todo/${username}`], { state: { id, email: userEmail, username } });
      } else {
        console.log('Error: Response does not contain a username.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this.message = `Error: ${error.response.data.message || error.response.data.error}`;
      } else {
        this.message = 'An unexpected error occurred';
      }
      console.error('Error:', error);
    }
  }
}
