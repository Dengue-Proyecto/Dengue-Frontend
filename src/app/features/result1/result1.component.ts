import {Component, OnInit} from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
    // Usar history.state directamente
    const state = history.state;

    if (state) {
      console.log('Datos recibidos en ResultComponent:', state);  // Verifica los datos recibidos
      this.riesgo_random_forest = state.riesgo_random_forest;

    }
  }

  descargarPDF() {
    const data = document.getElementById('pdfContent');

    if (data) {
      html2canvas(data).then(canvas => {
        const contentImg = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const headerImg = 'header.png'; // o base64
        const headerImage = new Image();
        headerImage.src = headerImg;

        headerImage.onload = () => {
          const headerMaxWidth = pageWidth * 0.9;
          const ratio = headerImage.height / headerImage.width;
          const headerHeight = headerMaxWidth * ratio;
          const headerX = (pageWidth - headerMaxWidth) / 2;
          const headerY = 10;

          //  Header
          pdf.addImage(headerImage, 'PNG', headerX, headerY, headerMaxWidth, headerHeight);

          // Contenido HTML
          const contentY = headerY + headerHeight + 10;
          const imgProps = pdf.getImageProperties(contentImg);
          const contentWidth = pageWidth * 0.8;
          const contentHeight = (imgProps.height * contentWidth) / imgProps.width;
          const contentX = (pageWidth - contentWidth) / 2;

          pdf.addImage(contentImg, 'PNG', contentX, contentY, contentWidth, contentHeight);

          // Fecha y hora
          const now = new Date();
          const fechaHora = now.toLocaleString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });

          // Calcular posición Y después del contenido
          const fechaY = contentY + contentHeight + 20;

          // Fecha y hora debajo del contenido
          pdf.setFontSize(11);
          pdf.setTextColor(80);
          pdf.text(`Fecha y hora: ${fechaHora}`, 15, fechaY);

          // Descargar
          pdf.save('resultado.pdf');
        };
      });
    }
  }

}
