import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  estaLogueado = false;
  mobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.estaLogueado$.subscribe({
      next: (logueado) => {
        this.estaLogueado = logueado;
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Prevenir scroll del body cuando el menú está abierto
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  async logout() {
    this.authService.logout();
    try {
      await this.router.navigate(['/inicio']);
    } catch (error) {
      console.error('Error al navegar al inicio:', error);
    }
  }
}
