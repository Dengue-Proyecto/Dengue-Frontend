import { Component, OnInit } from '@angular/core';
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
  sintomas_identificados: string[] = [];
  fecha_evaluacion!: string;
  hora_evaluacion!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Usar history.state directamente
    const state = history.state;

    if (state) {
      console.log('Datos recibidos en ResultComponent:', state);  // Verifica los datos recibidos
      this.riesgo_random_forest = state.riesgo_random_forest;
      this.sintomas_identificados = state.sintomas_identificados || [];

      // Procesar la fecha y hora
      if (state.fecha_evaluacion) {
        const fecha = new Date(state.fecha_evaluacion);
        this.fecha_evaluacion = fecha.toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        this.hora_evaluacion = fecha.toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }
  }

  volverEvaluar() {
    this.router.navigate(['/formulario']);
  }

  verEvaluaciones() {
    this.router.navigate(['/evaluaciones']);
  }

  async descargarPDF() {
    const data = document.getElementById('pdfContent');

    if (data) {
      try {
        // Ocultar botones temporalmente
        const buttons = data.querySelector('.button-container') as HTMLElement;
        if (buttons) {
          buttons.style.display = 'none';
        }

        // Esperar a que todas las fuentes y recursos se carguen
        await document.fonts.ready;

        // Pequeña espera adicional para asegurar renderizado completo
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(data, {
          scale: 2, // Mayor calidad
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: data.scrollWidth,
          windowHeight: data.scrollHeight,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('pdfContent');
            if (clonedElement) {
              // Asegurar que los estilos se apliquen correctamente
              clonedElement.style.minHeight = 'auto';
              clonedElement.style.padding = '20px';
            }
          }
        });

        const contentImg = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calcular dimensiones manteniendo aspect ratio
        const imgWidth = pageWidth - 20; // margen de 10mm a cada lado
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Agregar el contenido capturado
        pdf.addImage(contentImg, 'PNG', 10, 10, imgWidth, imgHeight);

        // Guardar el PDF
        pdf.save('evaluacion-dengue.pdf');

        // Restaurar botones
        if (buttons) {
          buttons.style.display = 'flex';
        }

      } catch (error) {
        console.error('Error al generar PDF:', error);

        // Restaurar botones en caso de error
        const buttons = data.querySelector('.button-container') as HTMLElement;
        if (buttons) {
          buttons.style.display = 'flex';
        }
      }
    }
  }
}
