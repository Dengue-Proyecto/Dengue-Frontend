import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          // Si el servidor responde con 401, significa que el token expiró
          if (error.status === 401) {
            console.log('Token expirado detectado por el servidor');
            this.authService.logout();
            this.router.navigate(['/inicio']);
          }
          return throwError(() => error);
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
