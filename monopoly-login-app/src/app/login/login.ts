import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  isLoginMode = true; // New property to toggle between login and signup

  constructor(private auth: Auth, private router: Router) {
    console.log('Login component initialized. isLoginMode:', this.isLoginMode); // Debug log
  }

  async loginWithEmailPassword() {
    try {
      console.log('Attempting email/password login with:', this.email); // Debug log
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Email/Password login successful!');
      this.router.navigate(['/home']); // Navigate to home after successful login
    } catch (error: any) {
      console.error('Email/Password login failed:', error.message);
      alert('Login failed: ' + error.message);
    }
  }

  async signUpWithEmailPassword() {
    try {
      console.log('Attempting email/password signup with:', this.email, this.password); // Debug log
      await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Email/Password signup successful!');
      this.router.navigate(['/home']); // Navigate to home after successful signup
    } catch (error: any) {
      console.error('Email/Password signup failed:', error.message);
      alert('Signup failed: ' + error.message);
    }
  }

  async loginWithGoogle() {
    try {
      console.log('Attempting Google login...'); // Debug log
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      console.log('Google login successful!');
      this.router.navigate(['/home']); // Navigate to home after successful login
    } catch (error: any) {
      console.error('Google login failed:', error.message);
      alert('Google login failed: ' + error.message);
    }
  }

  toggleMode(event: Event) {
    event.preventDefault(); // Prevent default anchor tag behavior
    this.isLoginMode = !this.isLoginMode;
    console.log('Toggled login mode. isLoginMode:', this.isLoginMode); // Debug log
  }
}
