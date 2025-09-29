import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DatosCMP} from '../../shared/models/datos-cmp';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario = {
    nombres: '',
    numeroColegiatura: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    contrasena: ''
  };

  buscando: boolean = false;
  errorCMP: boolean = false;
  mostrarContrasena: boolean = false;
  alertMessage: string = '';
  showAlert: boolean = false;
  alertSuccess: boolean = false; // <-- Controla el color de la alerta

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

  buscarPorCMP(cmpNum: string): Observable<DatosCMP> {
    let params = new HttpParams().set('cmp_num', cmpNum);
    return this.http.get<DatosCMP>(`${environment.apiUrl}/usuario/consulta_cmp`, { params });
  }

  buscarDatos() {
    if (!/^\d{6}$/.test(this.usuario.numeroColegiatura)) {
      this.mostrarAlerta('Ingrese un número de colegiatura válido de 6 dígitos', false);
      return;
    }

    this.buscando = true;
    this.errorCMP = false;

    this.buscarPorCMP(this.usuario.numeroColegiatura).subscribe({
      next: (datos: DatosCMP) => {
        this.usuario.nombres = datos.nombres;
        this.usuario.apellidoPaterno = datos.apellido_paterno;
        this.usuario.apellidoMaterno = datos.apellido_materno;
        this.buscando = false;
        this.errorCMP = false;
      },
      error: (error) => {
        console.error('Error al buscar datos CMP:', error);
        this.mostrarAlerta('No se encontraron datos para ese número de colegiatura. Puede ingresar los datos manualmente.', false);
        this.buscando = false;
        this.errorCMP = true; // activa campos manuales
        this.usuario.nombres = '';
        this.usuario.apellidoPaterno = '';
        this.usuario.apellidoMaterno = '';
      }
    });
  }

  onSubmit() {
    const u = this.usuario;

    // Validación de caracteres no permitidos en nombres y apellidos
    const letrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!letrasRegex.test(u.nombres) || !letrasRegex.test(u.apellidoPaterno) || !letrasRegex.test(u.apellidoMaterno)) {
      this.mostrarAlerta('Los nombres y apellidos solo deben contener letras y espacios.', false);
      return;
    }

    // Continuar con las validaciones ya existentes y el registro
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.correo);

    if (!u.nombres || !u.apellidoPaterno || !u.apellidoMaterno || !u.correo || !u.contrasena || !/^\d{6}$/.test(u.numeroColegiatura)) {
      this.mostrarAlerta('Por favor, complete correctamente todos los campos antes de enviar.', false);
      return;
    }

    if (!correoValido) {
      this.mostrarAlerta('Ingresa un correo válido.', false);
      return;
    }

    if (u.contrasena.length < 5) {
      this.mostrarAlerta('La contraseña debe tener al menos 5 caracteres.', false);
      return;
    }

    const datosRegistro = {
      numero_colegiatura: u.numeroColegiatura,
      nombres: u.nombres,
      apellido_paterno: u.apellidoPaterno,
      apellido_materno: u.apellidoMaterno,
      correo: u.correo,
      contrasena: u.contrasena
    };

    this.http.post(`${environment.apiUrl}/usuario/registrar_usuario`, datosRegistro)
      .subscribe({
        next: () => {
          this.mostrarAlerta('Registro exitoso.', true);
          setTimeout(async () => {
            try {
              await this.router.navigate(['/iniciar']);
            } catch (error) {
              console.error('Error al navegar al login:', error);
              this.mostrarAlerta('Registro exitoso pero error al navegar. Vaya al login manualmente.', false);
            }
          }, 1200);
        },
        error: (err) => {
          console.error('Error en registro:', err);
          if (err.status === 400 && err.error.detail === 'Usuario ya registrado') {
            this.mostrarAlerta('La cuenta ya existe.', false);
          } else {
            this.mostrarAlerta('Ocurrió un error al registrar. Intenta nuevamente.', false);
          }
        }
      });
  }

  soloNumeros(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  soloLetras(event: KeyboardEvent): void {
    const char = event.key;

    // Permite solo letras (a-z, A-Z), espacios y letras acentuadas
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

    // Si el carácter no es válido, previene su ingreso
    if (!regex.test(char)) {
      event.preventDefault();
    }
  }

  evitarPegadoInvalido(event: ClipboardEvent): void {
    const textoPegado = event.clipboardData?.getData('text') || '';
    const esNumerico = /^\d{1,6}$/.test(textoPegado);

    if (!esNumerico) {
      event.preventDefault();
    }
  }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  evitarPegadoConNumeros(event: ClipboardEvent): void {
    const textoPegado = event.clipboardData?.getData('text') || '';

    // Verifica si el texto pegado contiene números
    const contieneNumeros = /\d/.test(textoPegado);

    // Si el texto pegado contiene números, previene el pegado
    if (contieneNumeros) {
      event.preventDefault();
    }
  }

  async irLogin() {
    try {
      await this.router.navigate(['/iniciar']);
    } catch (error) {
      console.error('Error al navegar al login:', error);
    }
  }

  mostrarAlerta(mensaje: string, success: boolean = false) {
    this.alertMessage = mensaje;
    this.alertSuccess = success;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
