// src/app/components/about/about.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
}