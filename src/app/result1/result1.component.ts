import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

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

}
