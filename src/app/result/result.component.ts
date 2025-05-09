import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Cualquier lógica de inicialización que necesites
  }

  // Método para volver a intentar
  volverAIntentar() {
    this.router.navigate(['/form']);  // Suponiendo que la ruta al formulario es '/formulario'
  }
}
