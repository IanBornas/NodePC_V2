import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">NodePC</a>
        
        <div class="nav-links">
          <a routerLink="/">Home</a>
          <a routerLink="/products">Products</a>
          <a routerLink="/deals">Deals</a>
          
          <a routerLink="/cart" class="cart-link">
            Cart
            <span *ngIf="cartCount$ | async as count" class="cart-badge">
              {{count}}
            </span>
          </a>
          
          <a *ngIf="currentUser$ | async as user; else loginLink" 
             routerLink="/orders">
            Orders
          </a>
          
          <a *ngIf="(currentUser$ | async)?.role === 'ADMIN'" 
             routerLink="/admin">
            Admin
          </a>
          
          <ng-template #loginLink>
            <a routerLink="/login">Login</a>
          </ng-template>
          
          <button *ngIf="currentUser$ | async" 
                  (click)="logout()" 
                  class="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
    
    <main>
      <router-outlet />
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2023 NodePC. All Rights Reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
      padding: 1rem 0;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-links a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
    }

    .nav-links a:hover {
      color: #000;
    }

    .cart-link {
      position: relative;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -12px;
      background-color: #000;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.75rem;
    }

    .logout-btn {
      background: none;
      border: 1px solid #333;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .logout-btn:hover {
      background-color: #333;
      color: white;
    }

    main {
      min-height: calc(100vh - 200px);
    }

    .footer {
      background-color: #f5f5f5;
      border-top: 1px solid #ddd;
      padding: 2rem 0;
      margin-top: 4rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-links {
      display: flex;
      gap: 2rem;
    }

    .footer-links a {
      color: #666;
      text-decoration: none;
    }

    .footer-links a:hover {
      color: #000;
    }
  `]
})
export class AppComponent {
  get currentUser$() {
    return this.authService.currentUser$;
  }

  get cartCount$() {
    return this.cartService.cartItems$;
  }

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  logout(): void {
    this.authService.logout();
  }
}