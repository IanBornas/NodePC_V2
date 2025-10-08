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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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
