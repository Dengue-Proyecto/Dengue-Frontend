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
  codigo_evaluacion!: string;
  sintomas_identificados: string[] = [];
  fecha_evaluacion!: string;
  hora_evaluacion!: string;

  // Variables del médico para el PDF
  nombreMedico: string = 'Prueba';
  numeroCMP: string = '000000';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Usar history.state directamente
    const state = history.state;

    if (state) {
      console.log('Datos recibidos en ResultComponent:', state);  // Verifica los datos recibidos
      this.riesgo_random_forest = state.riesgo_random_forest;
      this.codigo_evaluacion = state.codigo_evaluacion; //
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
    const content = document.getElementById('pdfContent');
    if (!content) {
      console.error('No se encontró el elemento pdfContent');
      return;
    }

    // Guardar estados originales
    const container = content.parentElement;
    const originalContainerWidth = container?.style.width || '';
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    try {
      // Ocultar scroll y aplicar estilos para PDF
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Aplicar clase para generar PDF
      content.classList.add('pdf-generating');

      // Forzar ancho fijo en el contenedor
      if (container) {
        container.style.width = '750px';
        container.style.maxWidth = '750px';
        container.style.minWidth = '750px';
      }

      // Esperar a que las fuentes se carguen
      await document.fonts.ready;

      // Esperar renderizado completo
      await new Promise(resolve => setTimeout(resolve, 200));

      // Capturar el contenido con html2canvas
      const canvas = await html2canvas(content, {
        scale: 2.5, // Alta calidad para móviles
        useCORS: true,
        logging: false,
        width: 750, // Ancho fijo
        windowWidth: 750, // Ancho de ventana fijo
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        removeContainer: true,
        onclone: (clonedDoc) => {
          const clonedContent = clonedDoc.getElementById('pdfContent');
          if (clonedContent) {
            clonedContent.style.width = '750px';
            clonedContent.style.minWidth = '750px';
            clonedContent.style.maxWidth = '750px';
            clonedContent.style.transform = 'none';
          }
        }
      });

      // Crear PDF en orientación vertical, tamaño carta
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      // Dimensiones de la página
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calcular dimensiones de la imagen manteniendo aspect ratio
      const imgWidth = pageWidth - 20; // Márgenes de 10mm a cada lado
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Convertir canvas a imagen
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Si la imagen es más alta que la página, ajustar
      if (imgHeight > pageHeight - 20) {
        const scaleFactor = (pageHeight - 20) / imgHeight;
        const adjustedWidth = imgWidth * scaleFactor;
        const adjustedHeight = imgHeight * scaleFactor;
        const xOffset = (pageWidth - adjustedWidth) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, 10, adjustedWidth, adjustedHeight, undefined, 'FAST');
      } else {
        // Centrar verticalmente si hay espacio
        const yOffset = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight, undefined, 'FAST');
      }

      // Generar nombre de archivo
      const filename = `evaluacion-${this.codigo_evaluacion}.pdf`;

      // Guardar el PDF
      pdf.save(filename);

      console.log('PDF generado exitosamente:', filename);

    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor, intenta nuevamente.');
    } finally {
      // Restaurar todos los estilos originales
      content.classList.remove('pdf-generating');
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;

      if (container) {
        container.style.width = originalContainerWidth;
        container.style.maxWidth = '';
        container.style.minWidth = '';
      }

      // Forzar un pequeño scroll para "refrescar" la vista
      window.scrollBy(0, 1);
      window.scrollBy(0, -1);
    }
  }
}
