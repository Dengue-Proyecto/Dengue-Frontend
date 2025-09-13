import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);  // Obtén una instancia de AuthService
  const router = inject(Router);  // Obtén una instancia del Router

  // Verificar si el usuario tiene una sesión válida (no solo si existe token)
  if (authService.verificarSesionValida()) {
    // Si la sesión es válida, permite el acceso a la ruta
    return true;
  } else {
    // Si no tiene sesión válida, redirige al inicio
    return router.createUrlTree(['/inicio']);
  }
};
