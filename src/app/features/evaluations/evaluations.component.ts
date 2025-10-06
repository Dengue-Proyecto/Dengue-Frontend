import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

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
  sintomasFiltro: string = '';
  evaluacionesFiltradas: any[] = [];
  minFechaFin: string = '';
  fechaMaxima: string = '';

  // Propiedades para búsqueda por código
  codigoBusqueda: string = '';
  evaluacionBuscada: any = null;
  errorBusqueda: string = '';

  // Nuevas propiedades para vista y modal
  vistaActual: string = 'todos'; // 'todos' o 'pendientes'
  mostrarModal: boolean = false;
  evaluacionSeleccionada: any = null;
  riesgoRealSeleccionado: string = '';

  // Nuevas propiedades para paginación avanzada
  opcionesFilasPorPagina: number[] = [5, 10, 25, 50];

  // Para hacer Math disponible en el template
  Math = Math;

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

  // Agrega esto a tu componente
  private normalizarFechaParaIOS(fechaString: string): string {
    if (!fechaString) return fechaString;

    // Reemplazar espacio por 'T' para iOS
    let fecha = fechaString.replace(' ', 'T');

    // Si no tiene Z ni timezone, agregar Z
    if (!fecha.includes('Z') && !fecha.includes('+') && !fecha.match(/-\d{2}:\d{2}$/)) {
      if (fecha.includes('T')) {
        fecha += 'Z';
      }
    }

    return fecha;
  }

  // MÉTODO PARA BUSCAR POR CÓDIGO
  buscarEnTiempoReal() {
    this.errorBusqueda = '';

    if (!this.codigoBusqueda.trim()) {
      this.evaluacionBuscada = null;
      this.aplicarFiltros();
      return;
    }

    const textoBusqueda = this.codigoBusqueda.trim().toUpperCase();
    const codigoCompleto = `RDD-${textoBusqueda}`;

    // Buscar por el nombre correcto de la propiedad
    const evaluacionesCoincidentes = this.filas.filter(evaluacion =>
      evaluacion.codigo_evaluacion && evaluacion.codigo_evaluacion.toUpperCase().startsWith(codigoCompleto)
    );

    if (evaluacionesCoincidentes.length > 0) {
      this.filasPaginadas = evaluacionesCoincidentes;
      this.errorBusqueda = '';

      // Si hay coincidencia exacta, marcarla como seleccionada
      const coincidenciaExacta = evaluacionesCoincidentes.find(e =>
        e.codigo_evaluacion.toUpperCase() === codigoCompleto
      );
      this.evaluacionBuscada = coincidenciaExacta || null;

    } else {
      this.errorBusqueda = 'No se encontraron evaluaciones con ese código';
      this.evaluacionBuscada = null;
      this.filasPaginadas = [];
    }
  }

  // MÉTODO PARA LIMPIAR BÚSQUEDA
  limpiarBusqueda() {
    this.codigoBusqueda = '';
    this.evaluacionBuscada = null;
    this.errorBusqueda = '';

    // Recargar las evaluaciones normales
    this.aplicarFiltros();
  }

  establecerFechaMaxima() {
    const hoy = new Date();
    const ano = hoy.getFullYear();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoy.getDate().toString().padStart(2, '0');
    this.fechaMaxima = `${ano}-${mes}-${dia}`;
  }

  ajustarFechaHasta() {
    // Si no hay fecha de inicio, limpiar restricciones
    if (!this.fechaInicio) {
      this.minFechaFin = '';
      return;
    }

    this.minFechaFin = this.fechaInicio;

    // Si la fecha fin es anterior a la fecha inicio, ajustarla
    if (this.fechaFin && this.fechaFin < this.fechaInicio) {
      this.fechaFin = this.fechaInicio;
    }
  }

  validarFechaInicio() {
    if (!this.fechaInicio) return;

    // No permitir fechas futuras
    if (this.fechaInicio > this.fechaMaxima) {
      this.fechaInicio = this.fechaMaxima;
    }

    // Ajustar fecha fin si es necesario
    this.ajustarFechaHasta();
  }

  validarFechaFin() {
    if (!this.fechaFin) return;

    // No permitir fechas futuras
    if (this.fechaFin > this.fechaMaxima) {
      this.fechaFin = this.fechaMaxima;
    }

    // No permitir fechas anteriores a la fecha de inicio
    if (this.fechaInicio && this.fechaFin < this.fechaInicio) {
      this.fechaFin = this.fechaInicio;
    }
  }

  validarFechas(): boolean {
    if (this.fechaInicio && this.fechaFin) {
      return this.fechaInicio <= this.fechaFin &&
        this.fechaInicio <= this.fechaMaxima &&
        this.fechaFin <= this.fechaMaxima;
    }

    if (this.fechaInicio && this.fechaInicio > this.fechaMaxima) {
      return false;
    }

    if (this.fechaFin && this.fechaFin > this.fechaMaxima) {
      return false;
    }

    return true;
  }

  cambiarVista(vista: string) {
    this.vistaActual = vista;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    // Validar fechas antes de aplicar filtros
    if (!this.validarFechas()) {
      console.warn('Fechas inválidas detectadas, corrigiendo...');
      this.validarFechaInicio();
      this.validarFechaFin();
    }

    this.evaluacionesFiltradas = [...this.filas];

    // Filtro por vista (todos vs pendientes)
    if (this.vistaActual === 'pendientes') {
      this.evaluacionesFiltradas = this.evaluacionesFiltradas.filter(eva => !eva.resultado);
    }

    // Filtro por fechas mejorado
    if (this.fechaInicio || this.fechaFin) {
      this.evaluacionesFiltradas = this.evaluacionesFiltradas.filter(eva => {
        try {
          // AQUÍ está el cambio clave
          const fechaNormalizada = this.normalizarFechaParaIOS(eva.fecha);
          const fechaEval = new Date(fechaNormalizada);
          const fechaEvalStr = this.formatearFechaParaComparacion(fechaEval);

          let cumpleFechaInicio = true;
          let cumpleFechaFin = true;

          if (this.fechaInicio) {
            cumpleFechaInicio = fechaEvalStr >= this.fechaInicio;
          }

          if (this.fechaFin) {
            cumpleFechaFin = fechaEvalStr <= this.fechaFin;
          }

          return cumpleFechaInicio && cumpleFechaFin;
        } catch (error) {
          console.error('Error al procesar fecha:', eva.fecha, error);
          return false;
        }
      });
    }

    // Filtro por riesgo
    if (this.riesgoFiltro) {
      this.evaluacionesFiltradas = this.evaluacionesFiltradas.filter(eva => eva.riesgo === this.riesgoFiltro);
    }

    // Filtro por cantidad de síntomas
    if (this.sintomasFiltro) {
      this.evaluacionesFiltradas = this.evaluacionesFiltradas.filter(eva => {
        const cantidad = eva.cantidad_sintomas;
        switch (this.sintomasFiltro) {
          case '1-2':
            return cantidad >= 1 && cantidad <= 2;
          case '3-4':
            return cantidad >= 3 && cantidad <= 4;
          case '5+':
            return cantidad >= 5;
          default:
            return true;
        }
      });
    }

    this.totalPaginas = Math.ceil(this.evaluacionesFiltradas.length / this.registrosPorPagina);
    this.paginaActual = 1;

    if (this.evaluacionesFiltradas.length === 0) {
      this.filasPaginadas = [];
    } else {
      this.cambiarPagina(1);
    }
  }

  private formatearFechaParaComparacion(fecha: Date): string {
    const ano = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.riesgoFiltro = '';
    this.sintomasFiltro = '';
    this.minFechaFin = '';
    this.vistaActual = 'todos';
    this.evaluacionesFiltradas = [...this.filas];

    this.totalPaginas = Math.ceil(this.evaluacionesFiltradas.length / this.registrosPorPagina);
    this.paginaActual = 1;
    this.cambiarPagina(1);
  }

  cargarEvaluaciones() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => {
        // Normalizar todas las fechas una sola vez
        this.filas = data.map(evaluacion => ({
          ...evaluacion,
          fecha: this.normalizarFechaParaIOS(evaluacion.fecha)
        }));

        this.evaluacionesFiltradas = [...this.filas];
        this.totalPaginas = Math.ceil(data.length / this.registrosPorPagina);
        this.cambiarPagina(1);
      },
      error: err => {
        console.error('Error cargando evaluaciones', err);
      }
    });
  }

  // Métodos para el modal de riesgo real
  asignarRiesgoReal(evaluacion: any) {
    this.evaluacionSeleccionada = evaluacion;
    this.riesgoRealSeleccionado = '';
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.evaluacionSeleccionada = null;
    this.riesgoRealSeleccionado = '';
  }

  guardarRiesgoReal() {
    if (!this.evaluacionSeleccionada || !this.riesgoRealSeleccionado) {
      return;
    }

    const payload = {
      resultado: this.riesgoRealSeleccionado
    };

    // Aquí harías la llamada HTTP para actualizar el riesgo real
    const putUrl = `${environment.apiUrl}/evaluacion/${this.evaluacionSeleccionada.id}`;

    this.http.put(putUrl, payload).subscribe({
      next: (response) => {
        console.log('Riesgo real actualizado exitosamente', response);

        // Si había búsqueda activa, volver a buscar para actualizar
        if (this.evaluacionBuscada) {
          this.buscarEnTiempoReal();
        } else {
          // Actualizar localmente el registro
          const index = this.filas.findIndex(f => f.id === this.evaluacionSeleccionada.id);
          if (index !== -1) {
            this.filas[index].resultado = this.riesgoRealSeleccionado;
          }
          this.aplicarFiltros(); // Reaplicar filtros para actualizar la vista
        }

        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al actualizar riesgo real:', err);
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
    const fechaNormalizada = this.normalizarFechaParaIOS(fechaUtc);
    const opciones: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Lima',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    };
    return new Date(fechaNormalizada).toLocaleString('es-PE', opciones);
  }

  // Método para cambiar filas por página
  cambiarFilasPorPagina(nuevasFilas: any) {
    // Convertir a número para asegurar el tipo correcto
    const filasNum = Number(nuevasFilas);
    this.registrosPorPagina = filasNum;

    // Si hay búsqueda activa, no aplicar paginación normal
    if (this.evaluacionBuscada || this.codigoBusqueda.trim()) {
      // Para búsquedas, mantener todos los resultados visibles
      // ya que generalmente son pocos resultados
      return;
    }

    // Recalcular totales
    this.totalPaginas = Math.ceil(this.evaluacionesFiltradas.length / this.registrosPorPagina);

    // Ajustar la página actual si es necesario
    if (this.paginaActual > this.totalPaginas) {
      this.paginaActual = this.totalPaginas || 1;
    }

    // Aplicar la paginación
    this.cambiarPagina(this.paginaActual);
  }

  // Métodos para obtener información correcta de registros
  obtenerInicioRegistros(): number {
    if (this.evaluacionBuscada || this.codigoBusqueda.trim()) {
      return this.filasPaginadas.length > 0 ? 1 : 0;
    }
    return this.evaluacionesFiltradas.length === 0 ? 0 : (this.paginaActual - 1) * this.registrosPorPagina + 1;
  }

  obtenerFinRegistros(): number {
    if (this.evaluacionBuscada || this.codigoBusqueda.trim()) {
      return this.filasPaginadas.length;
    }
    return Math.min(this.paginaActual * this.registrosPorPagina, this.evaluacionesFiltradas.length);
  }

  obtenerTotalRegistros(): number {
    if (this.evaluacionBuscada || this.codigoBusqueda.trim()) {
      return this.filasPaginadas.length;
    }
    return this.evaluacionesFiltradas.length;
  }

  // Método para obtener array de números de página visibles
  obtenerPaginasVisibles(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5; // Máximo de números de página a mostrar

    if (this.totalPaginas <= maxPaginas) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= this.totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      // Lógica para páginas con puntos suspensivos
      if (this.paginaActual <= 3) {
        // Mostrar las primeras páginas
        paginas.push(1, 2, 3, 4);
        if (this.totalPaginas > 4) {
          paginas.push(-1); // -1 representa "..."
          paginas.push(this.totalPaginas);
        }
      } else if (this.paginaActual >= this.totalPaginas - 2) {
        // Mostrar las últimas páginas
        paginas.push(1);
        if (this.totalPaginas > 4) {
          paginas.push(-1); // -1 representa "..."
        }
        for (let i = this.totalPaginas - 3; i <= this.totalPaginas; i++) {
          if (i > 1) paginas.push(i);
        }
      } else {
        // Mostrar páginas alrededor de la actual
        paginas.push(1);
        paginas.push(-1);
        paginas.push(this.paginaActual - 1);
        paginas.push(this.paginaActual);
        paginas.push(this.paginaActual + 1);
        paginas.push(-1);
        paginas.push(this.totalPaginas);
      }
    }

    return paginas;
  }
}
