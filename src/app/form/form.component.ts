import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

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

      // Enviar los datos
      this.http.post('http://localhost:8000/evaluar_riesgo', formDataWithBooleans)
        .subscribe((response: any) => {
          // Recibimos la respuesta y redirigimos al componente de resultados con el riesgo
          this.router.navigate(['/result'], { state: { resultado: response.riesgo, probabilidad: response.probabilidad } });
        }, (error) => {
          console.error('Error en la solicitud:', error);
        });
    } else {
      console.log('Formulario inválido');
    }
  }

}
