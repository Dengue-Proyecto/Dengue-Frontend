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
    this.authService.estaLogueado$.subscribe(logueado => {
      this.estaLogueado = logueado;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/inicio']);

  }
}
