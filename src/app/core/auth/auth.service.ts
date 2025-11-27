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

  // Método optimizado para decodificar y validar token
  private decodificarToken(token: string): any | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Token inválido:', error);
      return null;
    }
  }

  // Método para verificar si el token es válido (no expirado)
  private esTokenValido(token: string): boolean {
    const payload = this.decodificarToken(token);
    if (!payload) return false;

    const ahora = Math.floor(Date.now() / 1000);
    return payload.exp > ahora;
  }

  // Método para acceder al valor actual de la autenticación
  get estaLogueado(): boolean {
    return this._estaLogueado.getValue();
  }

  // Método optimizado para verificar sesión (reduce accesos a localStorage)
  public verificarSesionValida(): boolean {
    const accessToken = this.obtenerToken();

    // Early return si access token es válido (caso más común)
    if (accessToken && this.esTokenValido(accessToken)) {
      return true;
    }

    // Solo verificar refresh token si access token no es válido
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken && this.esTokenValido(refreshToken)) {
      return true;
    }

    this.logout();
    return false;
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

  // Optimizado para reducir escrituras a localStorage
  login(tokenOResponse: string | any): void {
    const datosGuardar: Record<string, string> = {};

    if (typeof tokenOResponse === 'string') {
      // Formato legacy: solo token
      datosGuardar['token'] = tokenOResponse;
      datosGuardar['access_token'] = tokenOResponse;
    } else {
      // Formato nuevo: objeto con access_token y refresh_token
      datosGuardar['access_token'] = tokenOResponse.access_token;
      datosGuardar['refresh_token'] = tokenOResponse.refresh_token;

      // Guardar info adicional si existe
      if (tokenOResponse.usuario_id) {
        datosGuardar['usuario_id'] = tokenOResponse.usuario_id.toString();
      }
      if (tokenOResponse.nombre_completo) {
        datosGuardar['nombre_completo'] = tokenOResponse.nombre_completo;
      }
    }

    // Escribir todos los datos de una vez (más eficiente)
    Object.entries(datosGuardar).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    this._estaLogueado.next(true);
  }

  logout(): void {
    // Optimizado: limpiar múltiples items de forma eficiente
    const itemsALimpiar = ['token', 'access_token', 'refresh_token', 'usuario_id', 'nombre_completo'];
    itemsALimpiar.forEach(item => localStorage.removeItem(item));

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

  // Métodos para obtener información del usuario
  obtenerNombreUsuario(): string | null {
    return localStorage.getItem('nombre_completo');
  }

  obtenerUsuarioId(): string | null {
    return localStorage.getItem('usuario_id');
  }

  // Obtener iniciales del nombre para el avatar
  obtenerInicialesUsuario(): string {
    const nombreCompleto = this.obtenerNombreUsuario();
    if (!nombreCompleto) return 'U';

    const palabras = nombreCompleto.trim().split(' ');
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return palabras[0][0].toUpperCase();
  }
}
