import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  estaLogueado = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.estaLogueado$.subscribe({
      next: (logueado) => {
        this.estaLogueado = logueado;
      }
    });
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
