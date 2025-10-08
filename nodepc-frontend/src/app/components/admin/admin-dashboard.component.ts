// src/app/components/admin/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'overview';
  products: Product[] = [];
  orders: Order[] = [];
  
  totalRevenue = 50000;
  totalOrders = 1250;
  avgOrderValue = 40;
  
  showProductForm = false;
  editingProduct: Product | null = null;
  
  productData: any = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    badge: ''
  };

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      alert('Access denied. Admin only.');
      this.router.navigate(['/']);
      return;
    }

    this.loadProducts();
    this.loadOrders();
    this.calculateStats();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  calculateStats(): void {
    if (this.orders.length > 0) {
      this.totalOrders = this.orders.length;
      this.totalRevenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
      this.avgOrderValue = Math.round(this.totalRevenue / this.totalOrders);
    }
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productData = { ...product };
    this.showProductForm = true;
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      });
    }
  }

  saveProduct(): void {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, this.productData).subscribe({
        next: () => {
          alert('Product updated successfully');
          this.loadProducts();
          this.closeProductForm();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Failed to update product');
        }
      });
    } else {
      this.productService.createProduct(this.productData).subscribe({
        next: () => {
          alert('Product created successfully');
          this.loadProducts();
          this.closeProductForm();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Failed to create product');
        }
      });
    }
  }

  closeProductForm(): void {
    this.showProductForm = false;
    this.editingProduct = null;
    this.productData = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      badge: ''
    };
  }

  updateOrderStatus(order: Order): void {
    this.orderService.updateOrderStatus(order.id, order.status).subscribe({
      next: () => {
        alert('Order status updated');
      },
      error: (error) => {
        console.error('Error updating order:', error);
        alert('Failed to update order status');
      }
    });
  }

  viewOrder(order: Order): void {
    alert(`Order #${order.id}\nTotal: ${order.totalAmount}\nItems: ${order.items.length}`);
  }
}