// src/app/components/navbar/navbar.component.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="nav-root" role="banner">
      <div class="nav-inner">
        <a class="brand" routerLink="/" aria-label="NodePC home">
          <svg class="brand-logo" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2" fill="currentColor"/>
            <rect x="7" y="18" width="10" height="2" fill="currentColor"/>
          </svg>
          <span class="brand-text">NodePC</span>
        </a>

        <nav class="primary" role="navigation" aria-label="Primary">
          <ul class="links" [class.open]="menuOpen" id="primary-navigation">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a></li>
            <li><a routerLink="/products" routerLinkActive="active">Products</a></li>
            <li><a routerLink="/about" routerLinkActive="active">About</a></li>
            <li><a routerLink="/orders" routerLinkActive="active">Orders</a></li>
          </ul>
        </nav>

        <div class="controls">
          <label class="search" for="nav-search">
            <input id="nav-search" type="search" placeholder="Search parts, e.g. RTX 4070" aria-label="Search products">
            <button class="search-btn" aria-label="Submit search" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" fill="none"/></svg>
            </button>
          </label>

          <a class="icon-btn cart" routerLink="/cart" aria-label="Open cart">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-1.5 9h-11z" stroke="currentColor" stroke-width="1.25" fill="none"/><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
            <span class="badge" *ngIf="cartCount > 0" aria-live="polite">{{ cartCount }}</span>
          </a>

          <a class="icon-btn login" routerLink="/login" aria-label="Sign in">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 17v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.25" fill="none"/><circle cx="12" cy="11" r="3"/></svg>
          </a>

          <button
            class="hamburger"
            aria-label="Toggle menu"
            aria-controls="primary-navigation"
            [attr.aria-expanded]="menuOpen"
            (click)="toggleMenu()"
          >
            <span class="hamburger-box" aria-hidden="true">
              <span class="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </div>

      <div class="mobile-backdrop" *ngIf="menuOpen" (click)="closeMenu()" aria-hidden="true"></div>
    </header>
  `,
  styles: [`
    :host { display:block; --accent:#6d28d9; --fg:#111827; --muted:#6b7280; --bg:#fff; }

    .nav-root { position: sticky; top: 0; z-index: 80; background: var(--bg); border-bottom: 1px solid #edf2ff; }
    .nav-inner { max-width:1200px; margin:0 auto; display:flex; align-items:center; gap:16px; padding:10px 16px; }

    /* Brand */
    .brand { display:flex; align-items:center; gap:10px; text-decoration:none; color:var(--fg); font-weight:700; }
    .brand-logo { width:36px; height:36px; color:var(--accent); }
    .brand-text { font-size:1.05rem; }

    /* Primary navigation */
    .primary { margin-left: 24px; flex:1 1 auto; }
    .links { display:flex; gap:8px; list-style:none; margin:0; padding:0; align-items:center; }
    .links li a { color:var(--muted); text-decoration:none; padding:8px 12px; border-radius:8px; font-weight:600; display:inline-block; }
    .links li a:hover, .links li a:focus { color:var(--fg); background: rgba(109,40,217,0.06); outline: none; }
    .links li a.active { color: var(--accent); background: rgba(109,40,217,0.08); }

    /* Controls: search, cart, login, hamburger */
    .controls { display:flex; align-items:center; gap:8px; margin-left:auto; }

    .search { display:flex; align-items:center; gap:6px; background:#f8fafc; padding:6px 8px; border-radius:8px; border:1px solid transparent; }
    .search input { border: none; background: transparent; outline: none; min-width:160px; font-size:0.95rem; color:var(--fg); }
    .search input::placeholder { color: #9ca3af; font-weight:500; }
    .search-btn { background:transparent; border:none; padding:6px; cursor:pointer; color:var(--muted); }
    .icon-btn { display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:8px; text-decoration:none; color:var(--muted); background:transparent; border:none; position:relative; }
    .icon-btn:hover, .icon-btn:focus { color:var(--fg); background: rgba(0,0,0,0.03); outline: none; }

    .badge { position:absolute; top:6px; right:6px; min-width:18px; height:18px; padding:0 5px; border-radius:9px; background:var(--accent); color:white; font-size:11px; display:inline-flex; align-items:center; justify-content:center; font-weight:700; }

    /* Hamburger */
    .hamburger { display:none; background:transparent; border:none; padding:8px; cursor:pointer; }
    .hamburger-box { width:22px; height:16px; display:inline-block; position:relative; }
    .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after { background:var(--fg); width:22px; height:2px; border-radius:2px; display:block; position:absolute; left:0; transition: transform .18s ease, opacity .18s ease; }
    .hamburger-inner { top:50%; transform:translateY(-50%); }
    .hamburger-inner::before { content:''; top:-7px; }
    .hamburger-inner::after { content:''; top:7px; }

    /* Mobile behavior */
    @media (max-width: 920px) {
      .links { position: fixed; top:64px; right:12px; left:12px; background:var(--bg); flex-direction:column; gap:6px; padding:12px; border-radius:10px; box-shadow: 0 12px 40px rgba(2,6,23,0.12); max-height:0; overflow:hidden; transition: max-height .22s ease; }
      .links.open { max-height: 320px; }
      .primary { margin-left:0; }
      .search input { min-width: 70px; }
      .hamburger { display:inline-flex; margin-left:6px; }
    }

    /* Focus */
    a:focus, button:focus, input:focus { box-shadow: 0 0 0 3px rgba(109,40,217,0.14); border-radius:8px; }

    /* Small screens tweaks */
    @media (max-width: 520px) {
      .search { display:none; }
      .brand-text { display:none; }
    }
  `]
})
export class NavbarComponent {
  menuOpen = false;
  cartCount = 0;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 920 && this.menuOpen) this.closeMenu();
  }
}