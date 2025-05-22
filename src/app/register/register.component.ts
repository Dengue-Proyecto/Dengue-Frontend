import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  usuario = {
    nombres: '',
    colegiatura: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    contrasena: ''
  };

  onSubmit() {
    console.log('Datos enviados:', this.usuario);
    // Aquí puedes añadir lógica para enviar los datos a un backend
  }

  buscar() {
    // Simula búsqueda del número de colegiatura
    alert(`Buscando datos para colegiatura N° ${this.usuario.colegiatura}`);
  }
}
