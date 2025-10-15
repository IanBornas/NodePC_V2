import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: Customer | null = null;
  isEditing = false;

  profileData = {
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileData = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email,
          username: user.username || ''
        };
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset to current user data if canceling edit
      this.ngOnInit();
    }
  }

  saveProfile(): void {
    // TODO: Implement profile update functionality
    this.isEditing = false;
  }

  getUserStatus(): string {
    if (!this.currentUser) return 'Not logged in';
    return this.currentUser.role === 'ADMIN' ? 'Administrator' : 'Customer';
  }

  getFullName(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim();
  }
}
