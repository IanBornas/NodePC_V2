// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="home-main">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Build your dream PC with NodePC</h1>
          <p>Premium components, expert support, and wholesale options for retailers.</p>
          <div class="hero-ctas">
            <a routerLink="/products" class="btn btn-primary">Shop Now</a>
            <a routerLink="/about" class="btn btn-secondary">Wholesale & Retailers</a>
          </div>
        </div>
        <div class="hero-image">
          <!-- Placeholder for hero image -->
        </div>
      </section>

      <!-- Trust Bar -->
      <section class="trust-bar">
        <div class="trust-item">
          <span class="icon">🚚</span>
          <span>Free shipping over $99</span>
        </div>
        <div class="trust-item">
          <span class="icon">🛡️</span>
          <span>2-year limited warranty</span>
        </div>
        <div class="trust-item">
          <span class="icon">💬</span>
          <span>24/7 expert chat</span>
        </div>
        <div class="trust-logos">
          <div class="logo-placeholder">Intel</div>
          <div class="logo-placeholder">AMD</div>
          <div class="logo-placeholder">NVIDIA</div>
        </div>
      </section>

      <!-- Featured Categories -->
      <section class="categories">
        <h2>Shop by Category</h2>
        <div class="category-grid">
          <a routerLink="/products" class="category-card">
            <div class="category-icon">🖥️</div>
            <h3>GPUs</h3>
            <p>High-performance graphics cards</p>
          </a>
          <a routerLink="/products" class="category-card">
            <div class="category-icon">⚡</div>
            <h3>CPUs</h3>
            <p>Powerful processors for any build</p>
          </a>
          <a routerLink="/products" class="category-card">
            <div class="category-icon">💾</div>
            <h3>Storage</h3>
            <p>Fast SSDs and HDDs</p>
          </a>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-it-works">
        <h2>How It Works</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Browse</h3>
            <p>Explore our curated selection of premium PC components</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Configure</h3>
            <p>Use our tools to ensure compatibility and optimize performance</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Checkout & Support</h3>
            <p>Secure checkout with ongoing expert support</p>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="featured-products">
        <div class="section-header">
          <h2>Featured Products</h2>
          <a routerLink="/products" class="view-all">View All</a>
        </div>
        <div class="products-grid">
          <div *ngFor="let product of featuredProducts" class="product-card">
            <div class="product-image">
              <p>{{ product.category }}</p>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="price">\${{ product.price }}</p>
              <button
                class="btn btn-primary btn-sm"
                (click)="addToCart(product)"
                [disabled]="product.stock === 0">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Retailer Callout -->
      <section class="retailer-callout">
        <div class="callout-content">
          <h2>Become a NodePC Retailer</h2>
          <p>Join our wholesale network for volume pricing, fast fulfillment, and API access to inventory.</p>
          <ul>
            <li>Competitive wholesale pricing</li>
            <li>Bulk order discounts</li>
            <li>Dedicated account management</li>
          </ul>
          <a routerLink="/about" class="btn btn-primary">Apply for Wholesale</a>
        </div>
        <div class="callout-image">
          <!-- Placeholder -->
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials">
        <h2>What Our Customers Say</h2>
        <div class="testimonial-grid">
          <div class="testimonial">
            <div class="rating">★★★★★</div>
            <p>"NodePC helped me build my first gaming PC. Their support was incredible!"</p>
            <cite>- Alex M.</cite>
          </div>
          <div class="testimonial">
            <div class="rating">★★★★★</div>
            <p>"Fast shipping and quality components. Highly recommend for builders."</p>
            <cite>- Sarah K.</cite>
          </div>
          <div class="testimonial">
            <div class="rating">★★★★★</div>
            <p>"Great prices and expert advice. My go-to for PC parts."</p>
            <cite>- Mike R.</cite>
          </div>
        </div>
      </section>

      <!-- Newsletter Signup -->
      <section class="newsletter">
        <div class="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Get the latest deals, new product releases, and building tips.</p>
          <form class="newsletter-form">
            <input type="email" placeholder="Enter your email" required>
            <button type="submit" class="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .home-main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .hero {
      display: flex;
      align-items: center;
      gap: 4rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 5rem 3rem;
      border-radius: 16px;
      margin: 2rem 0 3rem;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
      opacity: 0.3;
    }

    .hero-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      font-weight: 800;
      line-height: 1.1;
    }

    .hero p {
      font-size: 1.3rem;
      margin-bottom: 2.5rem;
      opacity: 0.95;
      line-height: 1.6;
    }

    .hero-ctas {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .hero-image {
      width: 500px;
      height: 350px;
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .trust-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 2rem 3rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 4rem;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .trust-item .icon {
      font-size: 1.5rem;
    }

    .trust-logos {
      display: flex;
      gap: 2rem;
    }

    .logo-placeholder {
      padding: 0.5rem 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      font-weight: bold;
      color: #666;
    }

    .categories {
      text-align: center;
      margin-bottom: 4rem;
    }

    .categories h2 {
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .category-card {
      display: block;
      background: white;
      padding: 3rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
      text-align: center;
    }

    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .category-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .category-card h3 {
      margin-bottom: 0.5rem;
      color: #667eea;
    }

    .how-it-works {
      background: #f8f9fa;
      padding: 5rem 3rem;
      text-align: center;
      margin-bottom: 4rem;
    }

    .how-it-works h2 {
      font-size: 2.5rem;
      margin-bottom: 4rem;
      color: #333;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 3rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .step {
      background: white;
      padding: 3rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .step-number {
      width: 60px;
      height: 60px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto 1.5rem;
    }

    .step h3 {
      margin-bottom: 1rem;
      color: #333;
    }

    .featured-products {
      margin-bottom: 4rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      color: #333;
    }

    .view-all {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-5px);
    }

    .product-image {
      background: #f8f9fa;
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

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .retailer-callout {
      display: flex;
      align-items: center;
      gap: 4rem;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 5rem 3rem;
      border-radius: 16px;
      margin-bottom: 4rem;
    }

    .callout-content {
      flex: 1;
    }

    .callout-content h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }

    .callout-content ul {
      margin: 2rem 0;
      padding-left: 1.5rem;
    }

    .callout-content li {
      margin-bottom: 0.5rem;
    }

    .callout-image {
      width: 400px;
      height: 300px;
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      flex-shrink: 0;
    }

    .testimonials {
      text-align: center;
      margin-bottom: 4rem;
    }

    .testimonials h2 {
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #333;
    }

    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .testimonial {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .rating {
      color: #ffd700;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .testimonial p {
      font-style: italic;
      margin-bottom: 1rem;
      color: #555;
    }

    .testimonial cite {
      font-weight: 600;
      color: #667eea;
    }

    .newsletter {
      background: #667eea;
      color: white;
      padding: 4rem 3rem;
      text-align: center;
      border-radius: 16px;
    }

    .newsletter h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .newsletter p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .newsletter-form {
      display: flex;
      justify-content: center;
      gap: 1rem;
      max-width: 500px;
      margin: 0 auto;
      flex-wrap: wrap;
    }

    .newsletter-form input {
      flex: 1;
      min-width: 250px;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
    }

    .btn {
      display: inline-block;
      padding: 1rem 2.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a67d8;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
    }

    .btn-sm {
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .hero {
        flex-direction: column;
        text-align: center;
        padding: 3rem 2rem;
      }

      .hero h1 {
        font-size: 2.5rem;
      }

      .hero-ctas {
        justify-content: center;
      }

      .trust-bar {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .retailer-callout {
        flex-direction: column;
        text-align: center;
      }

      .newsletter-form {
        flex-direction: column;
        align-items: center;
      }

      .newsletter-form input {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Get first 6 products as featured
        this.featuredProducts = products.slice(0, 6);
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  }
}
