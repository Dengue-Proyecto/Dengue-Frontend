import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-result1',
  standalone: false,
  templateUrl: './result1.component.html',
  styleUrl: './result1.component.css'
})
export class Result1Component implements OnInit {

  // Variables para mostrar los resultados
  riesgo_random_forest!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Usar history.state directamente
    const state = history.state;

    if (state) {
      console.log('Datos recibidos en ResultComponent:', state);  // Verifica los datos recibidos
      this.riesgo_random_forest = state.riesgo_random_forest;
    }
  }

  volverEvaluar() {
    this.router.navigate(['/form']);
  }

  verEvaluaciones() {
    this.router.navigate(['/evaluations']);
  }

  descargarPDF() {
    const data = document.getElementById('pdfContent');

    if (data) {
      html2canvas(data).then(canvas => {
        const contentImg = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Agregar el contenido capturado
        const imgWidth = pageWidth - 20; // margen de 10mm a cada lado
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(contentImg, 'PNG', 10, 20, imgWidth, imgHeight);

        // Guardar el PDF
        pdf.save('evaluacion-dengue.pdf');
      }).catch(error => {
        console.error('Error al generar PDF:', error);
      });
    }
  }
}
