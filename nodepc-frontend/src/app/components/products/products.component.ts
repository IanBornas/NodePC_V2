// src/app/components/products/products.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { NavbarComponent } from '../navbar/navbar.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('1.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string | null = null;
  loading = true;
  searchQuery = '';
  sortBy = 'relevance';
  priceMin: number | null = null;
  priceMax: number | null = null;
  viewMode = 'grid';
  selectedProduct: Product | null = null;
  skeletonArray = Array(6).fill(0);
  allProductsCount = 0;
  popularProducts: Product[] = [];
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  activeFilters: { label: string; type: string }[] = [];



  // Recently restocked products
  recentlyRestocked: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // Initialize from URL params
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.selectedCategory = params['category'] || null;
      this.sortBy = params['sort'] || 'relevance';
      this.priceMin = params['min'] ? +params['min'] : null;
      this.priceMax = params['max'] ? +params['max'] : null;
      this.viewMode = params['view'] || 'grid';
      this.applyFilters();
    });

    // Debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchQuery = query;
      this.updateUrl();
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Empty state methods
  getEmptyStateTitle(): string {
    if (this.searchQuery || this.selectedCategory || this.priceMin || this.priceMax) {
      return 'No products match your filters';
    }
    return 'Out of stock right now';
  }

  getEmptyStateMessage(): string {
    if (this.searchQuery || this.selectedCategory || this.priceMin || this.priceMax) {
      return 'No results for your current filters. Try adjusting your search or clearing filters.';
    }
    return 'We\'re currently out of stock for this category. Sign up to be notified when items become available.';
  }



  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.allProductsCount = products.length;
        // Get popular products (mock: highest priced items)
        this.popularProducts = [...products]
          .sort((a, b) => b.price - a.price)
          .slice(0, 6);
        this.loading = false;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    this.updateUrl();
    this.applyFilters();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSortChange(): void {
    this.updateUrl();
    this.applyFilters();
  }

  onPriceChange(): void {
    this.updateUrl();
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.loading) return;

    let filtered = [...this.products];

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Price filter
    if (this.priceMin !== null) {
      filtered = filtered.filter(p => p.price >= this.priceMin!);
    }
    if (this.priceMax !== null) {
      filtered = filtered.filter(p => p.price <= this.priceMax!);
    }

    // Sort
    switch (this.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming products have an id or date, sort by id descending
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Relevance - keep original order
        break;
    }

    this.filteredProducts = filtered;
    this.updateActiveFilters();
  }

  updateActiveFilters(): void {
    this.activeFilters = [];
    if (this.selectedCategory) {
      this.activeFilters.push({ label: this.selectedCategory, type: 'category' });
    }
    if (this.searchQuery) {
      this.activeFilters.push({ label: `Search: ${this.searchQuery}`, type: 'search' });
    }
    if (this.priceMin !== null || this.priceMax !== null) {
      const min = this.priceMin || 0;
      const max = this.priceMax || '∞';
      this.activeFilters.push({ label: `Price: ₱${min} - ₱${max}`, type: 'price' });
    }
  }

  removeFilter(filter: { label: string; type: string }): void {
    switch (filter.type) {
      case 'category':
        this.selectedCategory = null;
        break;
      case 'search':
        this.searchQuery = '';
        break;
      case 'price':
        this.priceMin = null;
        this.priceMax = null;
        break;
    }
    this.updateUrl();
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedCategory = null;
    this.searchQuery = '';
    this.priceMin = null;
    this.priceMax = null;
    this.sortBy = 'relevance';
    this.updateUrl();
    this.applyFilters();
  }

  searchFor(term: string): void {
    this.searchQuery = term;
    this.updateUrl();
    this.applyFilters();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
    localStorage.setItem('productViewMode', mode);
    this.updateUrl();
  }

  scrollToCategories(): void {
    document.querySelector('.sidebar')?.scrollIntoView({ behavior: 'smooth' });
  }

  getSectionTitle(): string {
    if (this.selectedCategory) {
      return `${this.selectedCategory} (${this.filteredProducts.length})`;
    }
    if (this.searchQuery) {
      return `Search Results for "${this.searchQuery}" (${this.filteredProducts.length})`;
    }
    return `All Products (${this.filteredProducts.length})`;
  }

  getCategoryCount(category: string): number {
    return this.products.filter(p => p.category === category).length;
  }

  getVisibleCategories(): { name: string; count: number; emoji: string }[] {
    const categories = [
      { name: 'Desktops', emoji: '🖥️' },
      { name: 'Peripherals', emoji: '🖱️' },
      { name: 'Laptops', emoji: '💻' },
      { name: 'Storage', emoji: '💾' },
      { name: 'Components', emoji: '🔧' }
    ];

    return categories
      .map(cat => ({
        ...cat,
        count: this.getCategoryCount(cat.name)
      }))
      .filter(cat => cat.count > 0);
  }


  quickView(product: Product): void {
    this.selectedProduct = product;
  }

  closeQuickView(): void {
    this.selectedProduct = null;
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  updateUrl(): void {
    const params: any = {};
    if (this.searchQuery) params.search = this.searchQuery;
    if (this.selectedCategory) params.category = this.selectedCategory;
    if (this.sortBy !== 'relevance') params.sort = this.sortBy;
    if (this.priceMin !== null) params.min = this.priceMin;
    if (this.priceMax !== null) params.max = this.priceMax;
    if (this.viewMode !== 'grid') params.view = this.viewMode;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  }

  isNewProduct(product: Product): boolean {
    // Mock logic - consider products with ID > 10 as new
    return product.id > 10;
  }

  isBestSeller(product: Product): boolean {
    // Mock logic - consider products with price > 500 as best sellers
    return product.price > 500;
  }

  getStars(product: Product): string {
    // Mock rating - generate random 3-5 stars
    const rating = Math.floor(Math.random() * 3) + 3;
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  getReviewCount(product: Product): number {
    // Mock review count
    return Math.floor(Math.random() * 200) + 10;
  }

  getShippingETA(product: Product): string {
    if (product.stock > 0) {
      return product.stock > 5 ? 'Ships today' : 'Ships in 1-2 days';
    }
    return 'Preorder - ships in 2 weeks';
  }

  requestQuote(): void {
    alert('Quote request functionality would be implemented here. Contact sales@nodepc.com for wholesale pricing.');
  }
}