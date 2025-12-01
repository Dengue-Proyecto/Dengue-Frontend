import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eco-tip',
  standalone: false,
  templateUrl: './eco-tip.component.html',
  styleUrls: ['./eco-tip.component.css']
})
export class EcoTipComponent implements OnInit {
  mostrarConsejo: boolean = false;
  consejoActual: string = '';

  private consejos: string[] = [
    'Cierra las pestañas del navegador que no uses para ahorrar energía.',
    'Reduce el brillo de tu pantalla para consumir menos batería.',
    'Cierra sesión cuando termines para liberar recursos del servidor.',
    'Usa el modo oscuro cuando sea posible para ahorrar energía.',
    'Evita recargar páginas innecesariamente.',
    'Descarga solo los archivos que realmente necesitas.',
    'Desactiva las actualizaciones automáticas en segundo plano.',
    'Apaga tu dispositivo cuando no lo uses por períodos largos.',
    'Usa WiFi en lugar de datos móviles cuando sea posible.',
    'Comprime las imágenes antes de subirlas a la nube.'
  ];

  ngOnInit(): void {
    this.seleccionarConsejoAleatorio();
  }

  seleccionarConsejoAleatorio(): void {
    const indice = Math.floor(Math.random() * this.consejos.length);
    this.consejoActual = this.consejos[indice];
  }

  abrirConsejo(): void {
    this.mostrarConsejo = true;
  }

  cerrarConsejo(): void {
    this.mostrarConsejo = false;
  }

  nuevoConsejo(): void {
    this.seleccionarConsejoAleatorio();
  }
}
