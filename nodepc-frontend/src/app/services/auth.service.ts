import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUser = new BehaviorSubject<Customer | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser.next(user);
        })
      );
  }

  register(customer: any): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/register`, customer);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser.value !== null;
  }

  isAdmin(): boolean {
    return this.currentUser.value?.role === 'ADMIN';
  }

  getCurrentUser(): Customer | null {
    return this.currentUser.value;
  }
}