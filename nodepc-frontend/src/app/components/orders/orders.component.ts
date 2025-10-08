// src/app/components/orders/orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderStatus } from '../../models/order.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('1.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
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