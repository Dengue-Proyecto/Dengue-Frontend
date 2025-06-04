import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  datosLogin = {
    numero_colegiatura: '',
    contrasena: ''
  };

  showAlert: boolean = false;  // controla visibilidad alerta
  alertMessage: string = '';   // mensaje de alerta

  constructor(private http: HttpClient, public router: Router, private authService: AuthService) {}

  iniciarSesion() {
    this.showAlert = false; // limpia alerta anterior
    this.http.post(`${environment.apiUrl}/usuario/login`, this.datosLogin)
      .subscribe({
        next: (respuesta: any) => {
          this.authService.login(respuesta.access_token);
          this.router.navigate(['/formulario']);
        },
        error: (error) => {
          this.alertMessage = "Credenciales inválidas";
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 5000); // oculta después de 5 segundos
        }
      });
  }

  cerrarAlerta() {
    this.showAlert = false;
  }

  soloNumeros(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  evitarPegadoInvalido(event: ClipboardEvent): void {
    const textoPegado = event.clipboardData?.getData('text') || '';
    const esNumerico = /^\d+$/.test(textoPegado);

    if (!esNumerico || textoPegado.length !== 6) {
      event.preventDefault();
    }
  }

  irRegistrar() {
    this.router.navigate(['/registro']);
  }
}
