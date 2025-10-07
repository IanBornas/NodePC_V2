// src/app/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="products-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <h3>Categories</h3>
        <ul class="category-list">
          <li>
            <button 
              (click)="filterByCategory(null)" 
              [class.active]="selectedCategory === null">
              All Products
            </button>
          </li>
          <li>
            <button 
              (click)="filterByCategory('Desktops')" 
              [class.active]="selectedCategory === 'Desktops'">
              🖥️ Desktops
            </button>
          </li>
          <li>
            <button 
              (click)="filterByCategory('Peripherals')" 
              [class.active]="selectedCategory === 'Peripherals'">
              🖱️ Peripherals
            </button>
          </li>
          <li>
            <button 
              (click)="filterByCategory('Laptops')" 
              [class.active]="selectedCategory === 'Laptops'">
              💻 Laptops
            </button>
          </li>
          <li>
            <button 
              (click)="filterByCategory('Storage')" 
              [class.active]="selectedCategory === 'Storage'">
              💾 Storage
            </button>
          </li>
          <li>
            <button 
              (click)="filterByCategory('Components')" 
              [class.active]="selectedCategory === 'Components'">
              🔧 Components
            </button>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Hero Section -->
        <section class="hero">
          <div class="hero-content">
            <h1>Build Your Dream PC</h1>
            <p>Explore the latest and most affordable PC parts</p>
            <div class="hero-buttons">
              <button class="btn btn-secondary">Learn More</button>
              <button class="btn btn-primary">Shop Now</button>
            </div>
          </div>
          <div class="hero-image"></div>
        </section>

        <!-- Featured Products Section -->
        <section class="featured-section">
          <div class="section-header">
            <div class="placeholder-img"></div>
            <div>
              <h2>Featured Products</h2>
              <p>Best deals on PC components</p>
              <button class="btn btn-primary">View All</button>
            </div>
          </div>

          <div class="products-grid">
            <div *ngFor="let product of filteredProducts" class="product-card">
              <span *ngIf="product.badge" class="badge">{{product.badge}}</span>
              
              <div class="product-image">
                <p>{{product.category}}</p>
              </div>
              
              <div class="product-info">
                <h3>{{product.name}}</h3>
                <p class="price">\${{product.price}}</p>
                <p class="stock" [class.low-stock]="product.stock < 10">
                  {{product.stock > 0 ? 'In Stock: ' + product.stock : 'Out of Stock'}}
                </p>
                
                <div class="product-actions">
                  <button 
                    class="btn btn-primary btn-sm" 
                    (click)="addToCart(product)"
                    [disabled]="product.stock === 0">
                    Add to Cart
                  </button>
                  <button 
                    class="btn btn-secondary btn-sm" 
                    [routerLink]="['/products', product.id]">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="filteredProducts.length === 0" class="no-products">
            <p>No products found in this category.</p>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .products-container {
      display: flex;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .sidebar {
      width: 200px;
      flex-shrink: 0;
      background-color: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .sidebar h3 {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .category-list li {
      margin-bottom: 0.5rem;
    }

    .category-list button {
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      padding: 0.75rem;
      cursor: pointer;
      border-radius: 4px;
      font-size: 0.95rem;
    }

    .category-list button:hover {
      background-color: #e0e0e0;
    }

    .category-list button.active {
      background-color: #000;
      color: white;
    }

    .main-content {
      flex: 1;
    }

    .hero {
      display: flex;
      gap: 2rem;
      background-color: #666;
      color: white;
      padding: 3rem;
      border-radius: 8px;
      margin-bottom: 3rem;
    }

    .hero-content {
      flex: 1;
    }

    .hero h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .hero p {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
    }

    .hero-image {
      width: 300px;
      height: 200px;
      background-color: #888;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .featured-section {
      margin-bottom: 3rem;
    }

    .section-header {
      display: flex;
      gap: 2rem;
      align-items: center;
      margin-bottom: 2rem;
    }

    .placeholder-img {
      width: 120px;
      height: 120px;
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
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      transition: box-shadow 0.3s;
    }

    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

    .product-image {
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
      font-size: 1rem;
    }

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0.5rem 0;
    }

    .stock {
      font-size: 0.9rem;
      color: #28a745;
      margin-bottom: 1rem;
    }

    .stock.low-stock {
      color: #ffc107;
    }

    .product-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
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
      background-color: transparent;
      color: #000;
      border: 1px solid #000;
    }

    .btn-secondary:hover {
      background-color: #f5f5f5;
    }

    .no-products {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    
    if (category === null) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        p => p.category === category
      );
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  }
}