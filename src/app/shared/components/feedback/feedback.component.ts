import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface FeedbackData {
  velocidad: number;
  facilidad: number;
  eficiencia: number;
  comentario: string;
}

@Component({
  selector: 'app-feedback',
  standalone: false,
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  mostrarModal = false;
  enviado = false;
  enviando = false;

  feedback: FeedbackData = {
    velocidad: 0,
    facilidad: 0,
    eficiencia: 0,
    comentario: ''
  };

  constructor(private http: HttpClient) {}

  abrirModal() {
    this.mostrarModal = true;
    this.enviado = false;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.mostrarModal = false;
    document.body.style.overflow = 'auto';
    // Resetear después de cerrar
    setTimeout(() => {
      if (!this.mostrarModal) {
        this.resetearFormulario();
      }
    }, 300);
  }

  seleccionarPuntuacion(campo: keyof FeedbackData, valor: number) {
    if (campo !== 'comentario') {
      this.feedback[campo] = valor;
    }
  }

  enviarFeedback() {
    if (this.feedback.velocidad === 0 || this.feedback.facilidad === 0 || this.feedback.eficiencia === 0) {
      return;
    }

    this.enviando = true;

    // Guardar en localStorage como respaldo
    const feedbackGuardado = JSON.parse(localStorage.getItem('feedback_usuario') || '[]');
    feedbackGuardado.push({
      ...this.feedback,
      fecha: new Date().toISOString()
    });
    localStorage.setItem('feedback_usuario', JSON.stringify(feedbackGuardado));

    // Simular envío (el backend podría tener un endpoint para esto)
    setTimeout(() => {
      this.enviando = false;
      this.enviado = true;

      // Cerrar automáticamente después de 2 segundos
      setTimeout(() => {
        this.cerrarModal();
      }, 2000);
    }, 800);
  }

  resetearFormulario() {
    this.feedback = {
      velocidad: 0,
      facilidad: 0,
      eficiencia: 0,
      comentario: ''
    };
    this.enviado = false;
  }

  get formularioValido(): boolean {
    return this.feedback.velocidad > 0 &&
           this.feedback.facilidad > 0 &&
           this.feedback.eficiencia > 0;
  }
}
