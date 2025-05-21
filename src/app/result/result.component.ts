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

  precision_promedio!: number;
  recall_promedio!: number;
  tiempo_promedio!: number;
  mejor_modelo_nombre!: string;
  nivel_riesgo_mejor_modelo!: string;

  // metricas
  metricas: { [key: string]: any } = {};

  nombreModelos: { [key: string]: string } = {
    svm_linear: 'SVM Lineal',
    svm_poly: 'SVM Polinómico',
    svm_rbf: 'SVM RBF',
    svm_sigmoid: 'SVM Sigmoid',
    random_forest: 'Random Forest'
  };

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

      // metricas
      this.metricas = state.metricas || {};

      this.precision_promedio = state.precision_promedio;
      this.recall_promedio = state.recall_promedio;
      this.tiempo_promedio = state.tiempo_promedio;
      this.mejor_modelo_nombre = state.mejor_modelo_nombre;
      this.nivel_riesgo_mejor_modelo = state.nivel_riesgo_mejor_modelo;
    }
  }

}
