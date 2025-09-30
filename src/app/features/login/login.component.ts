import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    datosLogin = {
    numero_colegiatura: '',
    contrasena: ''
  };

  showAlert: boolean = false;  // controla visibilidad alerta
  alertMessage: string = '';   // mensaje de alerta
  mostrarContrasena: boolean = false;

  constructor(private http: HttpClient, public router: Router, private authService: AuthService) {}

  async ngOnInit() {
    // Verifica si el usuario ya está logueado
    if (this.authService.estaLogueado) {  // Accede directamente al valor de BehaviorSubject
      try {
        await this.router.navigate(['/inicio']);  // Cambia esta ruta por la que corresponda en tu aplicación
      } catch (error) {
        console.error('Error al navegar a inicio:', error);
      }
    }
  }

  iniciarSesion() {
    this.showAlert = false; // limpia alerta anterior
    this.http.post(`${environment.apiUrl}/usuario/login`, this.datosLogin)
      .subscribe({
        next: async (respuesta: any) => {
          this.authService.login(respuesta);
          try {
            await this.router.navigate(['/formulario']);
          } catch (error) {
            console.error('Error al navegar al formulario:', error);
            this.alertMessage = "Error al acceder al formulario";
            this.showAlert = true;
            setTimeout(() => {
              this.showAlert = false;
            }, 5000);
          }
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.alertMessage = "Credenciales inválidas";
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 5000);
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

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  async irRegistrar() {
    try {
      await this.router.navigate(['/registro']);
    } catch (error) {
      console.error('Error al navegar al registro:', error);
    }
  }
}
