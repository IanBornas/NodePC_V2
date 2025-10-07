// src/app/components/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="product-detail-container">
      <button class="back-btn" routerLink="/products">
        ← Back to Products
      </button>

      <div *ngIf="product" class="product-detail">
        <div class="product-image-section">
          <div class="main-image">
            <p>{{product.category}}</p>
          </div>
          <div class="thumbnail-images">
            <div class="thumbnail active">
              <p>View 1</p>
            </div>
            <div class="thumbnail">
              <p>View 2</p>
            </div>
            <div class="thumbnail">
              <p>View 3</p>
            </div>
          </div>
        </div>

        <div class="product-info-section">
          <div class="product-header">
            <span *ngIf="product.badge" class="badge">{{product.badge}}</span>
            <h1>{{product.name}}</h1>
            <p class="category">{{product.category}}</p>
          </div>

          <div class="price-section">
            <p class="price">\${{product.price}}</p>
            <p class="stock" [class.low-stock]="product.stock < 10" [class.out-of-stock]="product.stock === 0">
              {{product.stock > 0 ? 'In Stock: ' + product.stock : 'Out of Stock'}}
            </p>
          </div>

          <div class="description">
            <h3>Description</h3>
            <p>{{product.description}}</p>
          </div>

          <div class="specifications">
            <h3>Specifications</h3>
            <div class="spec-grid">
              <div class="spec-item">
                <span class="spec-label">Category:</span>
                <span class="spec-value">{{product.category}}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Availability:</span>
                <span class="spec-value">{{product.stock > 0 ? 'In Stock' : 'Out of Stock'}}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">SKU:</span>
                <span class="spec-value">PC-{{product.id}}</span>
              </div>
            </div>
          </div>

          <div class="purchase-section">
            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button (click)="decreaseQuantity()" class="qty-btn">-</button>
                <input 
                  type="number" 
                  [(ngModel)]="quantity" 
                  min="1" 
                  [max]="product.stock">
                <button 
                  (click)="increaseQuantity()" 
                  [disabled]="quantity >= product.stock"
                  class="qty-btn">
                  +
                </button>
              </div>
            </div>

            <div class="action-buttons">
              <button 
                class="btn btn-primary btn-large"
                (click)="addToCart()"
                [disabled]="product.stock === 0">
                Add to Cart
              </button>
              <button class="btn btn-secondary btn-large">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!product && !loading" class="not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button class="btn btn-primary" routerLink="/products">
          Browse Products
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        <p>Loading product...</p>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .back-btn {
      background: none;
      border: none;
      color: #666;
      font-size: 1rem;
      cursor: pointer;
      margin-bottom: 2rem;
      padding: 0.5rem;
    }

    .back-btn:hover {
      color: #000;
    }

    .product-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .product-image-section {
      position: sticky;
      top: 2rem;
      height: fit-content;
    }

    .main-image {
      width: 100%;
      height: 500px;
      background-color: #e0e0e0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #666;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .thumbnail-images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .thumbnail {
      height: 100px;
      background-color: #e0e0e0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      color: #666;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .thumbnail:hover {
      border-color: #999;
    }

    .thumbnail.active {
      border-color: #000;
    }

    .product-info-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .product-header {
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 1.5rem;
    }

    .badge {
      display: inline-block;
      background-color: #f0f0f0;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .category {
      color: #666;
      font-size: 1rem;
    }

    .price-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price {
      font-size: 2.5rem;
      font-weight: bold;
    }

    .stock {
      font-size: 1rem;
      color: #28a745;
      font-weight: 600;
    }

    .stock.low-stock {
      color: #ffc107;
    }

    .stock.out-of-stock {
      color: #dc3545;
    }

    .description h3,
    .specifications h3 {
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .description p {
      line-height: 1.7;
      color: #444;
    }

    .spec-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .spec-item {
      display: flex;
      padding: 0.75rem;
      background-color: #f9f9f9;
      border-radius: 4px;
    }

    .spec-label {
      font-weight: 600;
      width: 150px;
      flex-shrink: 0;
    }

    .spec-value {
      color: #666;
    }

    .purchase-section {
      background-color: #f9f9f9;
      padding: 2rem;
      border-radius: 8px;
      position: sticky;
      bottom: 2rem;
    }

    .quantity-selector {
      margin-bottom: 1.5rem;
    }

    .quantity-selector label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .qty-btn {
      width: 40px;
      height: 40px;
      border: 1px solid #ddd;
      background-color: white;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .qty-btn:hover:not(:disabled) {
      background-color: #f5f5f5;
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-controls input {
      width: 80px;
      height: 40px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
    }

    .btn-large {
      padding: 1rem 2rem;
      font-size: 1.1rem;
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
      border: 2px solid #000;
    }

    .btn-secondary:hover {
      background-color: #f5f5f5;
    }

    .not-found,
    .loading {
      text-align: center;
      padding: 4rem 2rem;
    }

    .not-found h2 {
      margin-bottom: 1rem;
    }

    .not-found p {
      color: #666;
      margin-bottom: 2rem;
    }

    @media (max-width: 968px) {
      .product-detail {
        grid-template-columns: 1fr;
      }

      .product-image-section {
        position: static;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      alert(`${this.product.name} (${this.quantity}) added to cart!`);
      this.quantity = 1;
    }
  }
}