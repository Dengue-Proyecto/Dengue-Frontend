import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  enviarFormulario() {
    if (this.form.valid) {
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
        diarrea: formData.diarrea === 'Si'
      };

      console.log('Datos del formulario:', formDataWithBooleans);

      // Simulación de la respuesta del backend
      const simulatedResponse = {
        riesgo: 'Riesgo Alto',
        probabilidad: 0.85,  // Simulando probabilidad
      };

      // Redirigir al componente de resultados con los valores simulados
      this.router.navigate(['/result'], {
        state: {
          resultadoModelo1: simulatedResponse.riesgo,
          probabilidadModelo1: simulatedResponse.probabilidad,
          resultadoModelo2: 'Riesgo Bajo',  // Puedes simular un segundo modelo también
          probabilidadModelo2: 0.75
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
