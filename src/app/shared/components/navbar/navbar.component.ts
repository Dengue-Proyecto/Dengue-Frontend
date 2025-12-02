import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {ThemeService} from '../../../core/theme/theme.service';
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
  userMenuOpen = false;
  nombreUsuario: string | null = null;
  inicialesUsuario: string = 'U';
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.estaLogueado$.subscribe({
      next: (logueado) => {
        this.estaLogueado = logueado;
        if (logueado) {
          this.cargarDatosUsuario();
        } else {
          this.nombreUsuario = null;
          this.inicialesUsuario = 'U';
        }
      }
    });

    // Suscribirse al estado del tema
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  cargarDatosUsuario() {
    this.nombreUsuario = this.authService.obtenerNombreUsuario();
    this.inicialesUsuario = this.authService.obtenerInicialesUsuario();
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
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

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
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
