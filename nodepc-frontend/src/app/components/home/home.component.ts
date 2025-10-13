// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  subscriptionMessage: string = '';

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

  onSubscribe(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    if (emailInput && emailInput.value) {
      // Simulate subscription (in real app, call service)
      this.subscriptionMessage = 'Thanks for joining! Check your email soon.';
      emailInput.value = '';
      setTimeout(() => {
        this.subscriptionMessage = '';
      }, 5000);
    }
  }
}
