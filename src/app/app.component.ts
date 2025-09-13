import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Dengue-Frontend';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // El servicio ya verifica automáticamente en el constructor,
    // pero podemos forzar una verificación adicional si es necesario
    this.authService.verificarSesionValida();
  }
}
