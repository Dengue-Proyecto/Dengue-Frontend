import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

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

  constructor() {
    // Al iniciar, revisa si hay token válido en localStorage
    this.verificarEstadoAutenticacion();
  }

  // Método para verificar el estado de autenticación al inicializar
  private verificarEstadoAutenticacion(): void {
    const token = localStorage.getItem('token');
    if (token && this.esTokenValido(token)) {
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
    const token = this.obtenerToken();
    if (token && this.esTokenValido(token)) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  login(token: string) {
    localStorage.setItem('token', token);
    this._estaLogueado.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this._estaLogueado.next(false);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }
}
