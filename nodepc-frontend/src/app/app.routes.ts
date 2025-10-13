// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { animation: 'fade' } },
  { path: 'products', component: ProductsComponent, data: { animation: 'fade' } },
  { path: 'products/:id', component: ProductDetailComponent, data: { animation: 'fade' } },
  { path: 'cart', component: CartComponent, data: { animation: 'fade' } },
  { path: 'orders', component: OrdersComponent, data: { animation: 'fade' } },
  { path: 'login', component: LoginComponent, data: { animation: 'fade' } },
  { path: 'profile', component: ProfileComponent, data: { animation: 'fade' } },
  { path: 'about', component: AboutComponent, data: { animation: 'fade' } },
  { path: 'admin', component: AdminDashboardComponent, data: { animation: 'fade' } },
  { path: '**', redirectTo: '' }
];