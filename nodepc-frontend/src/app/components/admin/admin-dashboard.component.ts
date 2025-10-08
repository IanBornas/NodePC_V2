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
  template: `
    <div class="admin-container">
      <h1>NodePC Admin Dashboard</h1>
      <p class="subtitle">Manage your ecommerce operations efficiently</p>

      <!-- Tabs -->
      <div class="tabs">
        <button 
          class="tab" 
          [class.active]="activeTab === 'overview'"
          (click)="activeTab = 'overview'">
          Overview
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'products'"
          (click)="activeTab = 'products'">
          Products
        </button>
        <button 
          class="tab" 
          [class.active]="activeTab === 'orders'"
          (click)="activeTab = 'orders'">
          Orders
        </button>
      </div>

      <!-- Overview Tab -->
      <div *ngIf="activeTab === 'overview'" class="tab-content">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Revenue</h3>
            <p class="stat-value">₱{{totalRevenue}}</p>
            <p class="stat-change positive">+10%</p>
          </div>
          <div class="stat-card">
            <h3>Total Orders</h3>
            <p class="stat-value">{{totalOrders}}</p>
            <p class="stat-change positive">+3%</p>
          </div>
          <div class="stat-card">
            <h3>Avg. Order Value</h3>
            <p class="stat-value">₱{{avgOrderValue}}</p>
            <p class="stat-change positive">+4%</p>
          </div>
        </div>

        <div class="chart-section">
          <h2>Sales Trends</h2>
          <div class="chart-placeholder">
            <p>Sales chart will be displayed here</p>
          </div>
        </div>
      </div>

      <!-- Products Tab -->
      <div *ngIf="activeTab === 'products'" class="tab-content">
        <div class="section-header">
          <h2>Latest PC Parts</h2>
          <p>Affordable prices on latest technology</p>
          <button class="btn btn-primary" (click)="showProductForm = true">
            Add New Product
          </button>
        </div>

        <div class="products-grid">
          <div *ngFor="let product of products" class="product-card-admin">
            <span *ngIf="product.badge" class="badge">{{product.badge}}</span>
            <div class="product-image">
              <p>{{product.category}}</p>
            </div>
            <div class="product-info">
              <h3>{{product.name}}</h3>
              <p class="price">₱{{product.price}}</p>
              <p class="stock">Stock: {{product.stock}}</p>
              <div class="product-actions">
                <button class="btn btn-sm btn-secondary" (click)="editProduct(product)">
                  Edit
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteProduct(product.id)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Tab -->
      <div *ngIf="activeTab === 'orders'" class="tab-content">
        <h2>All Orders</h2>
        
        <div class="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders">
                <td>#{{order.id}}</td>
                <td>Customer {{order.customerId}}</td>
                <td>{{order.orderDate | date:'short'}}</td>
                <td>₱{{order.totalAmount}}</td>
                <td>
                  <select 
                    [(ngModel)]="order.status" 
                    (change)="updateOrderStatus(order)"
                    class="status-select">
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button class="btn btn-sm btn-secondary" (click)="viewOrder(order)">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Product Form Modal -->
      <div *ngIf="showProductForm" class="modal-overlay" (click)="closeProductForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closeProductForm()">✕</button>
          
          <h2>{{editingProduct ? 'Edit Product' : 'Add New Product'}}</h2>

          <form (ngSubmit)="saveProduct()" #productForm="ngForm">
            <div class="form-group">
              <label for="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="productData.name"
                required>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                name="description"
                [(ngModel)]="productData.description"
                rows="3"
                required></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  [(ngModel)]="productData.price"
                  step="0.01"
                  min="0"
                  required>
              </div>

              <div class="form-group">
                <label for="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  [(ngModel)]="productData.stock"
                  min="0"
                  required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category">Category</label>
                <select
                  id="category"
                  name="category"
                  [(ngModel)]="productData.category"
                  required>
                  <option value="">Select category</option>
                  <option value="Graphics Card">Graphics Card</option>
                  <option value="Gaming CPU">Gaming CPU</option>
                  <option value="Motherboard">Motherboard</option>
                  <option value="High-speed RAM">High-speed RAM</option>
                  <option value="SSD">SSD</option>
                  <option value="Cooling Fan">Cooling Fan</option>
                  <option value="Power Supply">Power Supply</option>
                </select>
              </div>

              <div class="form-group">
                <label for="badge">Badge (Optional)</label>
                <select
                  id="badge"
                  name="badge"
                  [(ngModel)]="productData.badge">
                  <option value="">None</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Top Rated">Top Rated</option>
                  <option value="On Sale">On Sale</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="closeProductForm()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="productForm.invalid">
                {{editingProduct ? 'Update' : 'Create'}} Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      margin-bottom: 2rem;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .tab {
      padding: 1rem 2rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-weight: 600;
      color: #666;
      transition: all 0.3s;
    }

    .tab:hover {
      color: #000;
    }

    .tab.active {
      color: #000;
      border-bottom-color: #000;
    }

    .tab-content {
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-card h3 {
      color: #666;
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stat-change {
      font-size: 0.9rem;
      font-weight: 600;
    }

    .stat-change.positive {
      color: #28a745;
    }

    .chart-section {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .chart-section h2 {
      margin-bottom: 1.5rem;
    }

    .chart-placeholder {
      height: 300px;
      background-color: #f5f5f5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      margin-bottom: 0.5rem;
    }

    .section-header p {
      color: #666;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .product-card-admin {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      background-color: white;
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
      height: 180px;
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
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .product-actions {
      display: flex;
      gap: 0.5rem;
    }

    .orders-table {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #f9f9f9;
    }

    th {
      text-align: left;
      padding: 1rem;
      font-weight: 600;
      border-bottom: 2px solid #e0e0e0;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    tbody tr:hover {
      background-color: #f9f9f9;
    }

    .status-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
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

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      padding: 3rem;
      border-radius: 8px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .close-btn:hover {
      background-color: #f5f5f5;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 0.95rem;
    }

    input, textarea, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #000;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }
  `]
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