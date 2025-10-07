// src/app/components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>

      <div *ngIf="cartItems.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <button class="btn btn-primary" routerLink="/products">
          Continue Shopping
        </button>
      </div>

      <div *ngIf="cartItems.length > 0" class="cart-content">
        <div class="cart-items">
          <div *ngFor="let item of cartItems" class="cart-item">
            <div class="item-image">
              <p>{{item.product.category}}</p>
            </div>
            
            <div class="item-details">
              <h3>{{item.product.name}}</h3>
              <p class="item-description">{{item.product.description}}</p>
              <p class="item-price">\${{item.product.price}}</p>
            </div>

            <div class="item-quantity">
              <label>Quantity:</label>
              <div class="quantity-controls">
                <button 
                  (click)="decreaseQuantity(item)" 
                  class="qty-btn">
                  -
                </button>
                <input 
                  type="number" 
                  [(ngModel)]="item.quantity"
                  (change)="updateQuantity(item)"
                  min="1"
                  [max]="item.product.stock">
                <button 
                  (click)="increaseQuantity(item)"
                  [disabled]="item.quantity >= item.product.stock"
                  class="qty-btn">
                  +
                </button>
              </div>
              <p class="stock-info">Available: {{item.product.stock}}</p>
            </div>

            <div class="item-total">
              <p class="total-label">Total:</p>
              <p class="total-price">\${{item.product.price * item.quantity}}</p>
            </div>

            <button 
              class="remove-btn" 
              (click)="removeItem(item.product.id)"
              title="Remove item">
              ✕
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <h2>Order Summary</h2>
          
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>\${{getSubtotal()}}</span>
          </div>
          
          <div class="summary-row">
            <span>Shipping:</span>
            <span>\${{shippingCost}}</span>
          </div>
          
          <div class="summary-row">
            <span>Tax ({{taxRate * 100}}%):</span>
            <span>\${{getTax()}}</span>
          </div>
          
          <hr>
          
          <div class="summary-row total">
            <span>Total:</span>
            <span>\${{getTotal()}}</span>
          </div>

          <button 
            class="btn btn-primary btn-block" 
            (click)="proceedToCheckout()"
            [disabled]="!isAuthenticated">
            Proceed to Checkout
          </button>

          <p *ngIf="!isAuthenticated" class="login-message">
            Please <a routerLink="/login">login</a> to checkout
          </p>

          <button 
            class="btn btn-secondary btn-block" 
            routerLink="/products">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      margin-bottom: 2rem;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-cart p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 120px 1fr auto auto auto;
      gap: 1.5rem;
      align-items: center;
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      position: relative;
    }

    .item-image {
      width: 120px;
      height: 120px;
      background-color: #e0e0e0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .item-details h3 {
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .item-description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .item-price {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .item-quantity {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item-quantity label {
      font-size: 0.9rem;
      color: #666;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      background-color: white;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    .qty-btn:hover:not(:disabled) {
      background-color: #f5f5f5;
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-controls input {
      width: 60px;
      height: 32px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .stock-info {
      font-size: 0.85rem;
      color: #666;
    }

    .item-total {
      text-align: right;
    }

    .total-label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .total-price {
      font-size: 1.3rem;
      font-weight: bold;
    }

    .remove-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #999;
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .remove-btn:hover {
      background-color: #f5f5f5;
      color: #333;
    }

    .cart-summary {
      background-color: #f9f9f9;
      padding: 2rem;
      border-radius: 8px;
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    .cart-summary h2 {
      margin-bottom: 1.5rem;
      font-size: 1.3rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .summary-row.total {
      font-size: 1.3rem;
      font-weight: bold;
      margin-top: 1rem;
    }

    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 1.5rem 0;
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
      border: 1px solid #000;
    }

    .btn-secondary:hover {
      background-color: #f5f5f5;
    }

    .login-message {
      text-align: center;
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .login-message a {
      color: #000;
      font-weight: 600;
    }

    @media (max-width: 968px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .cart-item {
        grid-template-columns: 100px 1fr;
        gap: 1rem;
      }

      .item-quantity,
      .item-total {
        grid-column: 2;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  shippingCost = 10;
  taxRate = 0.08;
  isAuthenticated = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.isAuthenticated = this.authService.isAuthenticated();
  }

  updateQuantity(item: CartItem): void {
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    if (item.quantity > item.product.stock) {
      item.quantity = item.product.stock;
    }
    this.cartService.updateQuantity(item.product.id, item.quantity);
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stock) {
      item.quantity++;
      this.cartService.updateQuantity(item.product.id, item.quantity);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateQuantity(item.product.id, item.quantity);
    }
  }

  removeItem(productId: number): void {
    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  getSubtotal(): number {
    return Math.round(this.cartService.getTotal() * 100) / 100;
  }

  getTax(): number {
    return Math.round(this.getSubtotal() * this.taxRate * 100) / 100;
  }

  getTotal(): number {
    return Math.round((this.getSubtotal() + this.shippingCost + this.getTax()) * 100) / 100;
  }

  proceedToCheckout(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const orderData = {
      customerId: currentUser.id,
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: this.getTotal()
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        alert('Order placed successfully!');
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Failed to place order. Please try again.');
      }
    });
  }
}