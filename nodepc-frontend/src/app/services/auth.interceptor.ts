import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.getCurrentUser();
  if (user && user.token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${user.token}`)
    });
    return next(cloned);
  }
  return next(req);
};