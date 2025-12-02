import { Component, OnInit } from '@angular/core';
import html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';

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
  riesgo_xgboost!: string;

  // Variables para mostrar las probabilidades
  probabilidad_lineal_pct!: number;
  probabilidad_poli_pct!: number;
  probabilidad_rbf_pct!: number;
  probabilidad_sigmoid_pct!: number;
  probabilidad_random_forest_pct!: number;
  probabilidad_xgboost_pct!: number;

  precision_promedio!: number;
  recall_promedio!: number;
  tiempo_promedio!: number;
  mejor_modelo_nombre!: string;
  nivel_riesgo_mejor_modelo!: string;

  // métricas
  metricas: { [key: string]: any } = {};

  nombreModelos: { [key: string]: string } = {
    svm_linear: 'SVM Lineal',
    svm_poly: 'SVM Polinómico',
    svm_rbf: 'SVM RBF',
    svm_sigmoid: 'SVM Sigmoid',
    random_forest: 'Random Forest',
    xgboost: 'XGboost'
  };

  // Variables para la interpretación generada por Gemini
  interpretacion!: string;

  constructor() { }

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
      this.riesgo_xgboost = state.riesgo_xgboost;

      // Recibir y asignar las probabilidades en porcentaje
      this.probabilidad_lineal_pct = state.probabilidad_lineal_pct;
      this.probabilidad_poli_pct = state.probabilidad_poli_pct;
      this.probabilidad_rbf_pct = state.probabilidad_rbf_pct;
      this.probabilidad_sigmoid_pct = state.probabilidad_sigmoid_pct;
      this.probabilidad_random_forest_pct = state.probabilidad_random_forest_pct;
      this.probabilidad_xgboost_pct = state.probabilidad_xgboost_pct;

      // Asignar métricas
      this.metricas = state.metricas || {};

      this.precision_promedio = state.precision_promedio;
      this.recall_promedio = state.recall_promedio;
      this.tiempo_promedio = state.tiempo_promedio;
      this.mejor_modelo_nombre = state.mejor_modelo_nombre;
      this.nivel_riesgo_mejor_modelo = state.nivel_riesgo_mejor_modelo;

      // Asignar la interpretación
      this.interpretacion = state.interpretacion || "No se pudo generar la interpretación.";
      console.log("Interpretación:", this.interpretacion);
    }
  }

  // Función para limpiar el formato, reemplazar Markdown y agregar saltos de línea
  limpiarInterpretacion(): string {
    return this.interpretacion
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Reemplaza **texto** con <strong>texto</strong>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')  // Reemplaza *texto* con <em>texto</em>
      .replace(/\n/g, '<br>');  // Reemplaza saltos de línea (\n) por <br>
  }

  descargarPDF() {
    const content = document.getElementById('content-to-pdf') as HTMLElement;

    if (!content) {
      console.error('No se encontró el contenido para generar el PDF.');
      return;
    }

    // Ocultar los botones
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach((button: any) => button.style.display = 'none');

    // Aplicar clase para forzar fondo blanco en PDF
    content.classList.add('pdf-mode');

    // Escalar el contenido visualmente (temporal)
    content.style.transform = 'scale(0.8)';
    content.style.transformOrigin = 'top left';
    content.style.width = '125%';

    const opt = {
      margin: 6,
      filename: 'resultados_evaluacion.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: '#ffffff' }, // forzar fondo blanco
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .from(content)
      .set(opt)
      .toPdf()
      .get('pdf')
      .then((pdf: jsPDF) => {
        pdf.save('resultados_evaluacion.pdf');
        // Restaurar botones
        buttons.forEach((button: any) => button.style.display = 'inline');
        // Restaurar escala y remover clase PDF
        content.style.transform = '';
        content.style.transformOrigin = '';
        content.style.width = '';
        content.classList.remove('pdf-mode');
      })
      .catch((error: any) => {
        console.error('Error generando el PDF:', error);
        content.classList.remove('pdf-mode');
      });
  }

}
