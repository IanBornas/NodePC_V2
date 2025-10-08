// src/app/components/orders/orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderStatus } from '../../models/order.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="orders-container">
      <h1>My Orders</h1>

      <div *ngIf="!isAuthenticated" class="not-logged-in">
        <p>Please log in to view your orders.</p>
        <button class="btn btn-primary" (click)="goToLogin()">
          Go to Login
        </button>
      </div>

      <div *ngIf="isAuthenticated && orders.length === 0" class="no-orders">
        <p>You haven't placed any orders yet.</p>
        <button class="btn btn-primary" (click)="goToProducts()">
          Start Shopping
        </button>
      </div>

      <div *ngIf="isAuthenticated && orders.length > 0" class="orders-list">
        <div *ngFor="let order of orders" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <h3>Order #{{order.id}}</h3>
              <p class="order-date">{{order.orderDate | date:'medium'}}</p>
            </div>
            <div class="order-status">
              <span class="status-badge" [ngClass]="getStatusClass(order.status)">
                {{order.status}}
              </span>
            </div>
          </div>

          <div class="order-items">
            <div *ngFor="let item of order.items" class="order-item">
              <div class="item-info">
                <p class="item-name">{{item.productName}}</p>
                <p class="item-details">Quantity: {{item.quantity}} × ₱{{item.price}}</p>
              </div>
              <p class="item-total">₱{{item.quantity * item.price}}</p>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-total">
              <span>Total:</span>
              <span class="total-amount">₱{{order.totalAmount}}</span>
            </div>
            <div class="order-actions">
              <button class="btn btn-secondary btn-sm" (click)="viewOrderDetails(order.id)">
                View Details
              </button>
              <button 
                *ngIf="order.status === 'PENDING'" 
                class="btn btn-danger btn-sm"
                (click)="cancelOrder(order.id)">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      margin-bottom: 2rem;
    }

    .not-logged-in,
    .no-orders {
      text-align: center;
      padding: 4rem 2rem;
    }

    .not-logged-in p,
    .no-orders p {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .order-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      background-color: white;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .order-info h3 {
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    .order-date {
      color: #666;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.processing {
      background-color: #cfe2ff;
      color: #084298;
    }

    .status-badge.shipped {
      background-color: #d1e7dd;
      color: #0f5132;
    }

    .status-badge.delivered {
      background-color: #d1e7dd;
      color: #0a3622;
    }

    .status-badge.cancelled {
      background-color: #f8d7da;
      color: #842029;
    }

    .order-items {
      margin-bottom: 1.5rem;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #f9f9f9;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }

    .item-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .item-details {
      color: #666;
      font-size: 0.9rem;
    }

    .item-total {
      font-weight: bold;
      font-size: 1.1rem;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .order-total {
      display: flex;
      gap: 1rem;
      align-items: center;
      font-size: 1.1rem;
    }

    .total-amount {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .order-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .btn-primary {
      background-color: #000;
      color: white;
    }

    .btn-primary:hover {
      background-color: #333;
    }

    .btn-secondary {
      background-color: white;
      color: #000;
      border: 1px solid #000;
    }

    .btn-secondary:hover {
      background-color: #f5f5f5;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isAuthenticated = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (this.isAuthenticated) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.orderService.getOrdersByCustomer(currentUser.id).subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  getStatusClass(status: OrderStatus): string {
    return status.toLowerCase();
  }

  viewOrderDetails(orderId: number): void {
    alert(`Viewing details for order #${orderId}`);
    // You can implement a modal or navigate to a detail page
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.updateOrderStatus(orderId, 'CANCELLED').subscribe({
        next: () => {
          alert('Order cancelled successfully');
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order');
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}