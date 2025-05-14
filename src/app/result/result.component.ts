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

  // Variables para mostrar las probabilidades
  probabilidad_lineal_pct!: number;
  probabilidad_poli_pct!: number;
  probabilidad_rbf_pct!: number;
  probabilidad_sigmoid_pct!: number;
  probabilidad_random_forest_pct!: number;

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

      // Recibir y asignar las probabilidades en porcentaje
      this.probabilidad_lineal_pct = state.probabilidad_lineal_pct;
      this.probabilidad_poli_pct = state.probabilidad_poli_pct;
      this.probabilidad_rbf_pct = state.probabilidad_rbf_pct;
      this.probabilidad_sigmoid_pct = state.probabilidad_sigmoid_pct;
      this.probabilidad_random_forest_pct = state.probabilidad_random_forest_pct;
    }
  }

  volverAIntentar() {
    this.router.navigate(['/form']);  // Suponiendo que la ruta al formulario es '/formulario'
  }
}
