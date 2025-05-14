import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  standalone: false,
})
export class ResultComponent implements OnInit {

  // Variables para mostrar los resultados de los riesgos
  riesgo_lineal!: string;
  riesgo_poli!: string;
  riesgo_rbf!: string;
  riesgo_sigmoid!: string;
  riesgo_random_forest!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Usar history.state directamente
    const state = history.state;

    if (state) {
      console.log('Datos recibidos en ResultComponent:', state);  // Verifica los datos recibidos
      this.riesgo_lineal = state.riesgo_lineal;
      this.riesgo_poli = state.riesgo_poli;
      this.riesgo_rbf = state.riesgo_rbf;
      this.riesgo_sigmoid = state.riesgo_sigmoid;
      this.riesgo_random_forest = state.riesgo_random_forest;
    }
  }

  volverAIntentar() {
    this.router.navigate(['/form']);  // Suponiendo que la ruta al formulario es '/formulario'
  }
}
