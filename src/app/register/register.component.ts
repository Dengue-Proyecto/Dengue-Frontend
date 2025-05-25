import { Component } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {DatosCMP} from '../models/datos-cmp';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  usuario = {
    nombres: '',
    numeroColegiatura: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    contrasena: ''
  };

  buscando: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  buscarPorCMP(cmpNum: string): Observable<DatosCMP> {
    let params = new HttpParams().set('cmp_num', cmpNum);
    return this.http.get<DatosCMP>(`${environment.apiUrl}/usuario/consulta_cmp`, { params });
  }

  buscarDatos() {
    if (!/^\d{6}$/.test(this.usuario.numeroColegiatura)) {
      alert('Ingrese un número de colegiatura válido de 6 dígitos');
      return;
    }

    this.buscando = true;

    this.buscarPorCMP(this.usuario.numeroColegiatura).subscribe({
      next: (datos: DatosCMP) => {
        this.usuario.nombres = datos.nombres;
        this.usuario.apellidoPaterno = datos.apellido_paterno;
        this.usuario.apellidoMaterno = datos.apellido_materno;
        this.buscando = false;
      },
      error: () => {
        alert('No se encontraron datos para ese número de colegiatura.');
        this.buscando = false;
        this.usuario.nombres = '';
        this.usuario.apellidoPaterno = '';
        this.usuario.apellidoMaterno = '';
      }
    });
  }

  onSubmit() {
    const u = this.usuario;
    if (!u.nombres || !u.apellidoPaterno || !u.apellidoMaterno || !u.correo || !u.contrasena || !/^\d{6}$/.test(u.numeroColegiatura)) {
      alert('Por favor, complete correctamente todos los campos antes de enviar.');
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
          alert('Registro exitoso.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Ocurrió un error al registrar: ' + (err.error?.detail || err.message || 'Intenta nuevamente.'));
        }
      });
  }
}
