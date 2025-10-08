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
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
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