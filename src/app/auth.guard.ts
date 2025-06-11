import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);  // Obtén una instancia de AuthService
  const router = inject(Router);  // Obtén una instancia del Router

  // Verificar si el usuario está logueado
  if (authService.estaLogueado) {
    // Si está logueado, permite el acceso a la ruta
    return true;
  } else {
    // Si no está logueado, redirige al login
    router.navigate(['/inicio']);
    return false;
  }
};
