import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado que indica si hay usuario logueado o no
  private _estaLogueado = new BehaviorSubject<boolean>(false);

  // Observable para que otros componentes se suscriban
  get estaLogueado$(): Observable<boolean> {
    return this._estaLogueado.asObservable();
  }

  constructor(private http: HttpClient) {
    // Al iniciar, revisa si hay token válido en localStorage
    this.verificarEstadoAutenticacion();
  }

  // Método para verificar el estado de autenticación al inicializar
  private verificarEstadoAutenticacion(): void {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && this.esTokenValido(accessToken)) {
      this._estaLogueado.next(true);
    } else if (refreshToken && this.esTokenValido(refreshToken)) {
      // Access token expiró pero refresh token válido
      this._estaLogueado.next(true);
    } else {
      // Si no hay token o está expirado, limpiar estado
      this.logout();
    }
  }

  // Método para verificar si el token es válido (no expirado)
  private esTokenValido(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const ahora = Math.floor(Date.now() / 1000);
      return payload.exp > ahora;
    } catch (error) {
      console.error('Token inválido:', error);
      return false;
    }
  }

  // Método para acceder al valor actual de la autenticación
  get estaLogueado(): boolean {
    return this._estaLogueado.getValue();
  }

  // Método público para verificar si la sesión sigue siendo válida
  public verificarSesionValida(): boolean {
    const accessToken = this.obtenerToken();
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && this.esTokenValido(accessToken)) {
      return true;
    } else if (refreshToken && this.esTokenValido(refreshToken)) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  // NUEVO: Método para renovar tokens
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No hay refresh token'));
    }

    return this.http.post<any>(`${environment.apiUrl}/auth/refresh`, {
      refresh_token: refreshToken
    }).pipe(
      tap(response => {
        // Guardar nuevos tokens
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        this._estaLogueado.next(true);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // Actualizado para soportar ambos formatos (legacy y nuevo)
  login(tokenOResponse: string | any) {
    if (typeof tokenOResponse === 'string') {
      // Formato legacy: solo token
      localStorage.setItem('token', tokenOResponse);
      localStorage.setItem('access_token', tokenOResponse);
    } else {
      // Formato nuevo: objeto con access_token y refresh_token
      localStorage.setItem('access_token', tokenOResponse.access_token);
      localStorage.setItem('refresh_token', tokenOResponse.refresh_token);

      // Guardar info adicional si existe
      if (tokenOResponse.usuario_id) {
        localStorage.setItem('usuario_id', tokenOResponse.usuario_id.toString());
      }
      if (tokenOResponse.nombre_completo) {
        localStorage.setItem('nombre_completo', tokenOResponse.nombre_completo);
      }
    }

    this._estaLogueado.next(true);
  }

  logout() {
    // Limpiar ambos formatos
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('nombre_completo');
    this._estaLogueado.next(false);
  }

  // Retorna access_token (o token legacy si existe)
  obtenerToken(): string | null {
    return localStorage.getItem('access_token') || localStorage.getItem('token');
  }

  // NUEVO: Métodos auxiliares para el interceptor
  getAccessToken(): string | null {
    return localStorage.getItem('access_token') || localStorage.getItem('token');
  }
}
