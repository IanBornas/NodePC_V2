// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  showRegister = false;
  isLoading = false;
  errorMessage = '';
  registerError = '';
  successMessage = '';
  rememberMe = false;
  showPassword = false;
  showConfirmPassword = false;
  showForgotPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.successMessage = 'Login successful!';
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password';
        console.error('Login error:', error);
      }
    });
  }

  register(): void {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.registerError = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.registerError = '';
    this.successMessage = '';

    const userData = {
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      email: this.registerData.email,
      password: this.registerData.password
    };

    this.authService.register(userData).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully!';
        setTimeout(() => {
          this.showRegister = false;
          this.credentials.email = this.registerData.email;
          this.successMessage = '';
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.registerError = 'Failed to create account. Email may already be in use.';
        console.error('Registration error:', error);
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  forgotPassword(): void {
    this.showForgotPassword = true;
  }

  resetPassword(email: string): void {
    // Placeholder for password reset
    alert(`Password reset link sent to ${email}. (Backend integration pending)`);
    this.showForgotPassword = false;
  }

  closeForgotPassword(): void {
    this.showForgotPassword = false;
  }

  socialLogin(provider: string): void {
    alert(`${provider} login will be implemented soon!`);
  }
}