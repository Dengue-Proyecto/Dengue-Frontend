import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  currentPage = 1;
  totalPages = 2;  // Tres páginas para dividir las preguntas
  edades: number[] = [];
  diasDeFiebre: number[] = [];  // Lista para los días de fiebre
  tiempoInicio: number = 0;

  alertMessage: string = '';
  showAlert: boolean = false;
  alertSuccess: boolean = false; // Controla el color de la alerta (puede ser un mensaje de éxito o error)

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.form = this.fb.group({
      edad: [null, Validators.required],
      genero: ['', Validators.required],
      diasDeFiebre: [null, Validators.required],
      dolorCabezaSevero: ['', Validators.required],
      dolorDetrasOjos: ['', Validators.required],
      dolorArticularMuscular: ['', Validators.required],
      saborMetalicoBoca: ['', Validators.required],
      perdidaApetito: ['', Validators.required],
      dolorAbdominal: ['', Validators.required],
      nauseasVomitos: ['', Validators.required],
      diarrea: ['', Validators.required]
    });

    this.edades = Array.from({ length: 99 }, (_, i) => i + 1);
    this.diasDeFiebre = Array.from({ length: 15 }, (_, i) => i);
    this.iniciarEvaluacion();
  }

  iniciarEvaluacion() {
    this.tiempoInicio = Date.now();
  }

  siguiente() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  anterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  mostrarAlerta(mensaje: string, success: boolean = false) {
    this.alertMessage = mensaje;
    this.alertSuccess = success;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false; // Se cierra la alerta después de 5 segundos
    }, 5000);
  }

  enviarFormulario() {
    if (this.form.valid) {
      const tiempoFinal = Date.now();
      const tiempoEvaluacionSegundos = Math.floor((tiempoFinal - this.tiempoInicio) / 1000);
      const formData = this.form.value;

      const formDataWithBooleans = {
        edad: formData.edad,
        genero: formData.genero,
        dias_de_fiebre: formData.diasDeFiebre,
        dolor_cabeza_severo: formData.dolorCabezaSevero === 'Si',
        dolor_detras_ojos: formData.dolorDetrasOjos === 'Si',
        dolor_articular_muscular: formData.dolorArticularMuscular === 'Si',
        sabor_metalico_boca: formData.saborMetalicoBoca === 'Si',
        perdida_apetito: formData.perdidaApetito === 'Si',
        dolor_abdominal: formData.dolorAbdominal === 'Si',
        nauseas_vomitos: formData.nauseasVomitos === 'Si',
        diarrea: formData.diarrea === 'Si',
        tiempo_inicial: this.tiempoInicio,
        tiempo_final: tiempoFinal,
        tiempo_evaluacion: tiempoEvaluacionSegundos,
      };

      console.log('Datos del formulario:', formDataWithBooleans);

      this.http.post(`${environment.apiUrl}/evaluar_riesgo`, formDataWithBooleans)
        .subscribe({
          next: async (response: any) => {
            console.log('Respuesta del backend:', response);

            try {
              await this.router.navigate(['/resultado'], {
                state: {
                  riesgo_lineal: response.riesgo_lineal,
                  riesgo_poli: response.riesgo_poli,
                  riesgo_rbf: response.riesgo_rbf,
                  riesgo_sigmoid: response.riesgo_sigmoid,
                  riesgo_random_forest: response.riesgo_random_forest,
                  riesgo_xgboost: response.riesgo_xgboost,
                  probabilidad_lineal_pct: response.probabilidad_lineal_pct,
                  probabilidad_poli_pct: response.probabilidad_poli_pct,
                  probabilidad_rbf_pct: response.probabilidad_rbf_pct,
                  probabilidad_sigmoid_pct: response.probabilidad_sigmoid_pct,
                  probabilidad_random_forest_pct: response.probabilidad_random_forest_pct,
                  probabilidad_xgboost_pct: response.probabilidad_xgboost_pct,
                  metricas: response.metricas,
                  precision_promedio: response.precision_promedio,
                  recall_promedio: response.recall_promedio,
                  tiempo_promedio: response.tiempo_promedio,
                  interpretacion: response.interpretacion
                }
              });
            } catch (navigationError) {
              console.error('Error en la navegación:', navigationError);
              this.mostrarAlerta('Error al navegar al resultado. Intente nuevamente.');
            }
          },
          error: (error) => {
            console.error('Error en la solicitud:', error);
            this.mostrarAlerta('Error al procesar la evaluación. Intente nuevamente.');
          }
        });
    } else {
      this.form.markAllAsTouched();
      this.mostrarAlerta('Responda todas las preguntas antes de continuar.');
      console.log('Formulario inválido');
    }
  }
}
