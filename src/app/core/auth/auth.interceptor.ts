import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Añadir token si existe y no es ruta pública
    const token = this.authService.getAccessToken();

    if (token && !this.esRutaPublica(request.url)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el servidor responde con 401
        if (error.status === 401) {
          console.log('Token expirado detectado por el servidor');

          // Si es la ruta de refresh, significa que refresh token expiró
          if (this.esRutaRefresh(request.url)) {
            console.log('Refresh token expirado - cerrando sesión');
            this.authService.logout();
            this.router.navigate(['/inicio']);
            return throwError(() => error);
          }

          // Intentar renovar el token
          return this.manejarError401(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  private manejarError401(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si es login, no intentar renovar token - dejar que el componente maneje el error
    if (this.esRutaLogin(request.url)) {
      return throwError(() => new HttpErrorResponse({ status: 401 }));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      console.log('Intentando renovar tokens...');

      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.access_token);
          console.log('Tokens renovados exitosamente');

          // Reintentar petición con nuevo token
          const cloned = request.clone({
            setHeaders: {
              Authorization: `Bearer ${response.access_token}`
            }
          });

          return next.handle(cloned);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          console.error('Error al renovar tokens');
          this.authService.logout();
          this.router.navigate(['/inicio']);
          return throwError(() => error);
        })
      );
    } else {
      // Ya se está refrescando, esperar a que termine
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          const cloned = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(cloned);
        })
      );
    }
  }

  private esRutaLogin(url: string): boolean {
    return url.includes('/usuario/login');
  }

  private esRutaPublica(url: string): boolean {
    const rutasPublicas = ['/usuario/login', '/usuario/registrar_usuario', '/auth/token', '/usuario/consulta_cmp'];
    return rutasPublicas.some(ruta => url.includes(ruta));
  }

  private esRutaRefresh(url: string): boolean {
    return url.includes('/auth/refresh');
  }
}
