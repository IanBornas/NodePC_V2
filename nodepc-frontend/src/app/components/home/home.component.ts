// src/app/components/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="home-main">
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to NodePC</h1>
          <p>Build your dream PC with our premium components and accessories</p>
          <a routerLink="/products" class="btn btn-primary">Shop Now</a>
        </div>
        <div class="hero-image">
          <!-- Placeholder for hero image -->
        </div>
      </section>

      <section class="features">
        <h2>Why Choose NodePC?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>Quality Components</h3>
            <p>Premium PC parts from trusted manufacturers</p>
          </div>
          <div class="feature-card">
            <h3>Competitive Prices</h3>
            <p>Best deals on the latest technology</p>
          </div>
          <div class="feature-card">
            <h3>Expert Support</h3>
            <p>Get help from our PC building experts</p>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .home-main {
      padding-top: 2rem;
    }

    .hero {
      display: flex;
      align-items: center;
      gap: 3rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 2rem;
      border-radius: 12px;
      margin-bottom: 3rem;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-content {
      flex: 1;
    }

    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .hero p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-image {
      width: 400px;
      height: 250px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .btn {
      display: inline-block;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-primary:hover {
      background: #f8f9fa;
      transform: translateY(-2px);
    }

    .features {
      max-width: 1200px;
      margin: 0 auto 3rem;
      padding: 0 2rem;
      text-align: center;
    }

    .features h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #333;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-card h3 {
      color: #667eea;
      margin-bottom: 1rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }
  `]
})
export class HomeComponent {
}
