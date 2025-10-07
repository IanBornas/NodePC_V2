// src/app/components/about/about.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="about-main">
      <!-- Brand Snapshot -->
      <section class="hero">
        <div class="hero-content">
          <h1>About NodePC</h1>
          <p>Build your dream PC with premium components, competitive pricing, and expert support.</p>
          <p class="mission">"Our mission: make high-performance builds accessible to everyone."</p>
          <div class="values">
            <div class="value-item">
              <h3>Quality First</h3>
              <p>We test every component for reliability and performance.</p>
            </div>
            <div class="value-item">
              <h3>Fair Pricing</h3>
              <p>Direct sourcing and transparent margins for the best deals.</p>
            </div>
            <div class="value-item">
              <h3>Expert Help</h3>
              <p>Live build support and compatibility checks from our team.</p>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <!-- Placeholder for team/warehouse image -->
        </div>
      </section>

      <!-- Story and Mission -->
      <section class="story">
        <div class="story-content">
          <h2>Our Story</h2>
          <p>Founded in 2018 by a team of passionate PC enthusiasts, NodePC started as a small operation dedicated to providing gamers and builders with access to high-quality components at reasonable prices. We've grown from a local shop to a trusted online destination, serving thousands of customers worldwide.</p>
          <p>Our core values drive everything we do: integrity in our sourcing, excellence in our service, and innovation in how we support the PC building community.</p>
        </div>
        <div class="story-image">
          <!-- Placeholder for founder/team photo -->
        </div>
      </section>

      <!-- What You Sell and For Whom -->
      <section class="offerings">
        <div class="consumer-offering">
          <h2>For PC Builders & Gamers</h2>
          <p>Whether you're building your first gaming rig or upgrading your workstation, we provide curated parts, compatibility guidance, and expert support to ensure your build is perfect.</p>
          <ul>
            <li>Custom PC build planning</li>
            <li>Component compatibility checks</li>
            <li>Performance optimization advice</li>
            <li>Post-build support and warranties</li>
          </ul>
        </div>
        <div class="retailer-offering">
          <h2>For Retailers</h2>
          <p>Join our wholesale network for volume pricing, fast fulfillment, and API access to inventory and pricing. Perfect for computer shops, system integrators, and resellers.</p>
          <a routerLink="/contact" class="btn btn-primary">Contact Sales</a>
          <a href="#" class="btn btn-secondary">Download Retailer Guide</a>
        </div>
      </section>

      <!-- Proof and Credibility -->
      <section class="proof">
        <h2>Trusted by Thousands</h2>
        <div class="metrics">
          <div class="metric">
            <span class="number">5,000+</span>
            <span class="label">Happy Builders</span>
          </div>
          <div class="metric">
            <span class="number">98%</span>
            <span class="label">Positive Reviews</span>
          </div>
          <div class="metric">
            <span class="number">2 Years</span>
            <span class="label">Warranty on Parts</span>
          </div>
        </div>
        <div class="partners">
          <h3>Trusted Brands</h3>
          <div class="brand-logos">
            <!-- Placeholder for partner logos -->
            <div class="logo-placeholder">Intel</div>
            <div class="logo-placeholder">AMD</div>
            <div class="logo-placeholder">NVIDIA</div>
            <div class="logo-placeholder">Corsair</div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="process">
        <h2>How It Works</h2>
        <div class="process-steps">
          <div class="step">
            <h3>1. Browse & Select</h3>
            <p>Explore our curated selection of premium PC components.</p>
          </div>
          <div class="step">
            <h3>2. Configure & Check</h3>
            <p>Use our compatibility tools and get expert advice.</p>
          </div>
          <div class="step">
            <h3>3. Checkout & Build</h3>
            <p>Secure checkout with fast shipping to your door.</p>
          </div>
          <div class="step">
            <h3>4. Support & Warranty</h3>
            <p>Ongoing support and comprehensive warranties.</p>
          </div>
        </div>
      </section>

      <!-- Team and Contact -->
      <section class="team">
        <h2>Meet Our Team</h2>
        <div class="team-members">
          <div class="member">
            <div class="member-photo">
              <!-- Placeholder -->
            </div>
            <h3>John Doe</h3>
            <p>Founder & CEO</p>
            <p>Former hardware engineer with 10+ years in PC building.</p>
          </div>
          <div class="member">
            <div class="member-photo">
              <!-- Placeholder -->
            </div>
            <h3>Jane Smith</h3>
            <p>Head of Support</p>
            <p>Ensures every customer gets the help they need.</p>
          </div>
        </div>
        <div class="contact">
          <h3>Get In Touch</h3>
          <p>For partnerships, press inquiries, or wholesale opportunities:</p>
          <a href="mailto:sales@nodepc.com" class="btn btn-primary">Email Sales</a>
          <a routerLink="/contact" class="btn btn-secondary">Contact Form</a>
        </div>
      </section>

      <!-- Calls to Action -->
      <section class="ctas">
        <div class="cta-primary">
          <h2>Ready to Build?</h2>
          <p>Start your PC building journey today with our premium components.</p>
          <a routerLink="/products" class="btn btn-primary">Shop Products</a>
        </div>
        <div class="cta-secondary">
          <h3>Become a Retailer</h3>
          <p>Join our network and grow your business with NodePC.</p>
          <a routerLink="/contact" class="btn btn-secondary">Learn More</a>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .about-main {
      padding-top: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding-bottom: 4rem;
    }

    .hero {
      display: flex;
      align-items: center;
      gap: 3rem;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 4rem 2rem;
      border-radius: 12px;
      margin-bottom: 3rem;
    }

    .hero-content {
      flex: 1;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .mission {
      font-style: italic;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .values {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .value-item h3 {
      margin-bottom: 0.5rem;
      color: #fff;
    }

    .hero-image {
      width: 400px;
      height: 300px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .story {
      display: flex;
      gap: 3rem;
      margin-bottom: 3rem;
      align-items: center;
    }

    .story-content {
      flex: 1;
    }

    .story h2 {
      margin-bottom: 1rem;
      color: #333;
    }

    .story p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .story-image {
      width: 300px;
      height: 200px;
      background: #e0e0e0;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .offerings {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .offerings h2 {
      margin-bottom: 1rem;
    }

    .offerings ul {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    .offerings li {
      margin-bottom: 0.5rem;
    }

    .retailer-offering .btn {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 1rem;
    }

    .proof {
      text-align: center;
      margin-bottom: 3rem;
      padding: 3rem;
      background: #f9f9f9;
      border-radius: 12px;
    }

    .proof h2 {
      margin-bottom: 2rem;
    }

    .metrics {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .metric .number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #667eea;
      display: block;
    }

    .metric .label {
      font-size: 1rem;
      color: #666;
    }

    .partners h3 {
      margin-bottom: 1rem;
    }

    .brand-logos {
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .logo-placeholder {
      padding: 1rem 2rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-weight: bold;
    }

    .process {
      margin-bottom: 3rem;
    }

    .process h2 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .process-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .step {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .step h3 {
      margin-bottom: 1rem;
      color: #667eea;
    }

    .team {
      margin-bottom: 3rem;
    }

    .team h2 {
      text-align: center;
      margin-bottom: 2rem;
    }

    .team-members {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .member {
      text-align: center;
    }

    .member-photo {
      width: 150px;
      height: 150px;
      background: #e0e0e0;
      border-radius: 50%;
      margin: 0 auto 1rem;
    }

    .member h3 {
      margin-bottom: 0.5rem;
    }

    .member p {
      margin-bottom: 0.5rem;
      color: #666;
    }

    .contact {
      text-align: center;
      padding: 2rem;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .contact h3 {
      margin-bottom: 1rem;
    }

    .contact .btn {
      margin: 0 0.5rem;
    }

    .ctas {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
      padding: 3rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
    }

    .cta-primary h2 {
      margin-bottom: 1rem;
    }

    .cta-primary .btn {
      margin-top: 1rem;
    }

    .cta-secondary {
      padding: 2rem;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
    }

    .cta-secondary h3 {
      margin-bottom: 1rem;
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
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5a67d8;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
    }

    @media (max-width: 768px) {
      .hero, .story, .offerings, .ctas {
        flex-direction: column;
        text-align: center;
      }

      .hero-image, .story-image {
        width: 100%;
        max-width: 400px;
      }

      .metrics {
        flex-direction: column;
        gap: 1rem;
      }

      .team-members {
        flex-direction: column;
      }

      .brand-logos {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class AboutComponent {
}