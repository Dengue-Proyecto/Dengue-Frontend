import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-result',
  standalone: false,
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit {
  resultado: string | null = '';

  constructor() {
  }

  ngOnInit(): void {
    // Obtener el estado que contiene el resultado enviado desde el formulario
    const state = history.state;
    if (state && state.resultado) {
      this.resultado = state.resultado;
    }
  }
}
