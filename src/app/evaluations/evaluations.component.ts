import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-evaluations',
  standalone: false,
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.css'
})
export class EvaluationsComponent implements OnInit {
  filas: any[] = [];
  paginaActual: number = 1;
  registrosPorPagina: number = 5;
  totalPaginas: number = 1;
  filasPaginadas: any[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  riesgoFiltro: string = '';
  evaluacionesFiltradas: any[] = [];
  minFechaFin: string = '';
  fechaMaxima: string = '';

  // Usar la URL base de environment
  private apiUrl = `${environment.apiUrl}/mis_evaluaciones`;

  // Mapa para mostrar texto amigable de síntomas
  mapaSintomas: { [clave: string]: string } = {
    'dolor_cabeza_severo': 'Dolor de cabeza severo',
    'dolor_detras_ojos': 'Dolor detrás de los ojos',
    'dolor_articular_muscular': 'Dolor articular y muscular',
    'sabor_metalico_boca': 'Sabor metálico en la boca',
    'perdida_apetito': 'Pérdida de apetito',
    'dolor_abdominal': 'Dolor abdominal',
    'nauseas_vomitos': 'Náuseas y vómitos',
    'diarrea': 'Diarrea',
    'dias_de_fiebre': 'Días con fiebre',
  };

  constructor(private http: HttpClient) {
    this.establecerFechaMaxima();
  }

  ngOnInit() {
    this.cargarEvaluaciones();
  }

  establecerFechaMaxima() {
    const hoy = new Date();
    const ano = hoy.getFullYear();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoy.getDate().toString().padStart(2, '0');
    this.fechaMaxima = `${ano}-${mes}-${dia}`;
  }

  ajustarFechaHasta() {
    this.minFechaFin = this.fechaInicio; // deshabilita fechas anteriores en "Hasta"
    if (this.fechaFin && this.fechaFin < this.minFechaFin) {
      this.fechaFin = this.minFechaFin; // corrige si estaba antes de la fecha mínima
    }
  }

  aplicarFiltros() {
    this.evaluacionesFiltradas = [...this.filas];

    if (this.fechaInicio && this.fechaFin) {
      function fechaLocalString(fecha: Date): string {
        const ano = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
      }

      const inicioStr = this.fechaInicio;
      const finStr = this.fechaFin;

      this.evaluacionesFiltradas = this.evaluacionesFiltradas.filter(eva => {
        try {
          const fechaEvalStr = fechaLocalString(new Date(eva.fecha));
          return fechaEvalStr >= inicioStr && fechaEvalStr <= finStr;
        } catch {
          return false;
        }
      });
    }

    if (this.riesgoFiltro) {
      this.evaluacionesFiltradas = this.evaluacionesFiltradas.filter(eva => eva.riesgo === this.riesgoFiltro);
    }

    this.totalPaginas = Math.ceil(this.evaluacionesFiltradas.length / this.registrosPorPagina);
    this.paginaActual = 1;

    if (this.evaluacionesFiltradas.length === 0) {
      this.filasPaginadas = [];
    } else {
      this.cambiarPagina(1);
    }
  }

  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.riesgoFiltro = '';
    this.minFechaFin = '';
    this.evaluacionesFiltradas = [...this.filas];

    this.totalPaginas = Math.ceil(this.filas.length / this.registrosPorPagina);
    this.paginaActual = 1;
    this.filasPaginadas = this.filas.slice(0, this.registrosPorPagina);
  }

  cargarEvaluaciones() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => {
        this.filas = data;
        this.evaluacionesFiltradas = [...data];
        this.totalPaginas = Math.ceil(data.length / this.registrosPorPagina);
        this.cambiarPagina(1);
      },
      error: err => {
        console.error('Error cargando evaluaciones', err);
      }
    });
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.registrosPorPagina;
    this.filasPaginadas = this.evaluacionesFiltradas.slice(inicio, inicio + this.registrosPorPagina);
  }

  siguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.cambiarPagina(this.paginaActual + 1);
    }
  }

  anterior() {
    if (this.paginaActual > 1) {
      this.cambiarPagina(this.paginaActual - 1);
    }
  }

  formatearTiempo(segundos: number): string {
    const hrs = Math.floor(segundos / 3600);
    const min = Math.floor((segundos % 3600) / 60);
    const seg = segundos % 60;

    const partes = [];
    if (hrs > 0) partes.push(`${hrs}h`);
    if (min > 0) partes.push(`${min}m`);
    partes.push(`${seg}s`);

    return partes.join(' ');
  }

  formatearSintoma(texto: string): string {
    if (this.mapaSintomas[texto]) {
      return this.mapaSintomas[texto];
    }

    if (texto.includes(':')) {
      const [clave, valor] = texto.split(':');
      return clave.trim().charAt(0).toUpperCase() + clave.trim().slice(1) + ': ' + valor.trim();
    }

    const textoSinGuion = texto.replace(/_/g, ' ');
    return textoSinGuion.charAt(0).toUpperCase() + textoSinGuion.slice(1);
  }

  convertirFecha(fechaUtc: string): string {
    const opciones: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Lima',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    };
    return new Date(fechaUtc).toLocaleString('es-PE', opciones);
  }
}
