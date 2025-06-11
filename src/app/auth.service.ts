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
    // Al iniciar, revisa si hay token en localStorage para mantener estado
    const token = localStorage.getItem('token');
    this._estaLogueado.next(!!token);
  }

  // Método para acceder al valor actual de la autenticación
  get estaLogueado(): boolean {
    return this._estaLogueado.getValue();
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
