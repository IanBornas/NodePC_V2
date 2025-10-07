// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to NodePC</h1>
          <p>Your one-stop shop for the latest PC parts at affordable prices.</p>
          <div class="hero-buttons">
            <button class="btn btn-secondary" routerLink="/products">
              Learn More
            </button>
            <button class="btn btn-primary" routerLink="/products">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      <!-- Login Section -->
      <section class="login-section">
        <div class="login-card card">
          <h2>Login to Your Account</h2>
          <p>Access exclusive deals and save your favorite products.</p>
          <button class="btn btn-primary" routerLink="/login">
            Go to Login
          </button>
        </div>
      </section>

      <!-- Latest Products -->
      <section class="products-section">
        <div class="section-header">
          <div class="placeholder-img"></div>
          <div>
            <h2>Latest Products</h2>
            <p>Check out the newest arrivals in PC parts.</p>
            <button class="btn btn-primary" routerLink="/products">
              View All
            </button>
          </div>
        </div>

        <div class="products-grid">
            <div *ngIf="loading" class="loading-card card">
              <p>Loading products...</p>
            </div>
            <div *ngIf="error" class="error-card card">
              <p>{{error}}</p>
              <button class="btn btn-primary" (click)="loadFeaturedProducts()">Retry</button>
            </div>
            <div *ngFor="let product of featuredProducts" class="product-card card">
              <span *ngIf="product.badge" class="badge">{{product.badge}}</span>
              <div class="product-placeholder">
                <p>{{product.category}}</p>
              </div>
              <div class="product-info">
                <h3>{{product.name}}</h3>
                <p class="product-description">{{product.description}}</p>
                <button class="btn-link" [routerLink]="['/products', product.id]">
                  View Details →
                </button>
              </div>
            </div>
          </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      border-radius: 12px;
      margin-bottom: 3rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: #000;
      color: white;
    }

    .btn-primary:hover {
      background-color: #333;
    }

    .btn-secondary {
      background-color: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background-color: rgba(255,255,255,0.1);
    }

    .login-section {
      margin-bottom: 3rem;
    }

    .login-card {
      max-width: 500px;
      margin: 0 auto;
      text-align: center;
    }

    .login-card h2 {
      margin-bottom: 0.5rem;
    }

    .login-card p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .products-section {
      margin-bottom: 3rem;
    }

    .section-header {
      display: flex;
      gap: 2rem;
      align-items: center;
      margin-bottom: 2rem;
    }

    .placeholder-img {
      width: 150px;
      height: 150px;
      background-color: #e0e0e0;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .section-header h2 {
      margin-bottom: 0.5rem;
    }

    .section-header p {
      color: #666;
      margin-bottom: 1rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .product-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }

    .badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: #f0f0f0;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 1;
    }

    .product-placeholder {
      background-color: #e0e0e0;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #666;
    }

    .product-info {
      padding: 1.5rem;
    }

    .product-info h3 {
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .product-description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .btn-link {
      background: none;
      border: none;
      color: #000;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-decoration: none;
      display: inline-block;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    .loading-card, .error-card {
      text-align: center;
      padding: 2rem;
    }

    .error-card p {
      color: #dc3545;
      margin-bottom: 1rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.loading = true;
    this.error = null;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 3);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }
}