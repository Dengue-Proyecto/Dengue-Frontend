 import { Component } from '@angular/core';
 import {HttpClient} from '@angular/common/http';
 import {environment} from '../../environments/environment';
 import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  datosLogin = {
    numero_colegiatura: '',
    contrasena: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  iniciarSesion() {
    this.http.post(`${environment.apiUrl}/usuario/login`, this.datosLogin)
      .subscribe({
        next: (respuesta: any) => {
          console.log('Token:', respuesta.access_token);
          localStorage.setItem('token', respuesta.access_token);
          this.router.navigate(['/form']);
        },
        error: (error) => {
          console.error('Error en login:', error);
          alert("Credenciales inválidas");
        }
      });
  }

  soloNumeros(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  evitarPegadoInvalido(event: ClipboardEvent): void {
    const textoPegado = event.clipboardData?.getData('text') || '';
    const esNumerico = /^\d+$/.test(textoPegado); // solo números

    if (!esNumerico || textoPegado.length !== 6) {
      event.preventDefault(); // cancelar pegado si contiene letras o no tiene 6 dígitos
    }
  }

}
