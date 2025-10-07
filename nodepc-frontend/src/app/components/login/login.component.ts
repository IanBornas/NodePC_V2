// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Login to Your Account</h2>
        <p class="subtitle">Access exclusive deals and save your favorite products.</p>

        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="credentials.email"
              placeholder="Enter your email"
              required
              email
              #emailInput="ngModel">
            <div *ngIf="emailInput.invalid && emailInput.touched" class="error-message">
              Please enter a valid email
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="credentials.password"
              placeholder="Enter your password"
              required
              minlength="6"
              #passwordInput="ngModel">
            <div *ngIf="passwordInput.invalid && passwordInput.touched" class="error-message">
              Password must be at least 6 characters
            </div>
          </div>

          <div *ngIf="errorMessage" class="error-alert">
            {{errorMessage}}
          </div>

          <button 
            type="button" 
            class="btn btn-secondary btn-block"
            (click)="forgotPassword()">
            Forgot Password?
          </button>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            [disabled]="loginForm.invalid || isLoading">
            {{isLoading ? 'Logging in...' : 'Login'}}
          </button>
        </form>

        <div class="divider">
          <span>or</span>
        </div>

        <div class="register-section">
          <p>Don't have an account?</p>
          <button class="btn btn-outline btn-block" (click)="showRegister = true">
            Create Account
          </button>
        </div>
      </div>

      <!-- Registration Form (shown when showRegister is true) -->
      <div *ngIf="showRegister" class="modal-overlay" (click)="showRegister = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="showRegister = false">✕</button>
          
          <h2>Create Account</h2>
          <p class="subtitle">Join NodePC today!</p>

          <form (ngSubmit)="register()" #registerForm="ngForm">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  [(ngModel)]="registerData.firstName"
                  placeholder="First name"
                  required>
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  [(ngModel)]="registerData.lastName"
                  placeholder="Last name"
                  required>
              </div>
            </div>

            <div class="form-group">
              <label for="regEmail">Email</label>
              <input
                type="email"
                id="regEmail"
                name="regEmail"
                [(ngModel)]="registerData.email"
                placeholder="Enter your email"
                required
                email>
            </div>

            <div class="form-group">
              <label for="regPassword">Password</label>
              <input
                type="password"
                id="regPassword"
                name="regPassword"
                [(ngModel)]="registerData.password"
                placeholder="Create a password"
                required
                minlength="6">
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="registerData.confirmPassword"
                placeholder="Confirm your password"
                required>
            </div>

            <div *ngIf="registerError" class="error-alert">
              {{registerError}}
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-block"
              [disabled]="registerForm.invalid || isLoading">
              {{isLoading ? 'Creating Account...' : 'Create Account'}}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 500px;
      margin: 4rem auto;
      padding: 2rem;
    }

    .login-card {
      background-color: white;
      padding: 3rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h2 {
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: #000;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .error-alert {
      background-color: #f8d7da;
      color: #842029;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
    }

    .btn-block {
      width: 100%;
      margin-bottom: 1rem;
    }

    .btn-primary {
      background-color: #000;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #333;
    }

    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: white;
      color: #000;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background-color: #f5f5f5;
    }

    .btn-outline {
      background-color: transparent;
      color: #000;
      border: 2px solid #000;
    }

    .btn-outline:hover {
      background-color: #000;
      color: white;
    }

    .divider {
      text-align: center;
      margin: 2rem 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background-color: #ddd;
    }

    .divider span {
      background-color: white;
      padding: 0 1rem;
      position: relative;
      color: #666;
    }

    .register-section {
      text-align: center;
    }

    .register-section p {
      color: #666;
      margin-bottom: 1rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      padding: 3rem;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .close-btn:hover {
      background-color: #f5f5f5;
    }
  `]
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigate(['/products']);
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

    const userData = {
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      email: this.registerData.email,
      password: this.registerData.password
    };

    this.authService.register(userData).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.showRegister = false;
        alert('Account created successfully! Please log in.');
        this.credentials.email = this.registerData.email;
      },
      error: (error) => {
        this.isLoading = false;
        this.registerError = 'Failed to create account. Email may already be in use.';
        console.error('Registration error:', error);
      }
    });
  }

  forgotPassword(): void {
    alert('Password reset functionality will be implemented soon!');
  }
}