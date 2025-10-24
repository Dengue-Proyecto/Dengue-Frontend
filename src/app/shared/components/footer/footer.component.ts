import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  mostrarModalPolitica: boolean = false;
  mostrarModalFlujo: boolean = false;
  mostrarModalEliminarCuenta: boolean = false;

  constructor(public authService: AuthService) {}

  abrirModalPolitica() {
    this.mostrarModalPolitica = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalPolitica() {
    this.mostrarModalPolitica = false;
    document.body.style.overflow = 'auto';
  }

  abrirModalFlujo() {
    this.mostrarModalFlujo = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalFlujo() {
    this.mostrarModalFlujo = false;
    document.body.style.overflow = 'auto';
  }

  abrirModalEliminarCuenta() {
    this.mostrarModalEliminarCuenta = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalEliminarCuenta() {
    this.mostrarModalEliminarCuenta = false;
    document.body.style.overflow = 'auto';
  }

  confirmarEliminarCuenta() {
    console.log('Eliminar cuenta confirmado');
    this.cerrarModalEliminarCuenta();
    // TODO: Implementar la eliminación de cuenta
  }
}
