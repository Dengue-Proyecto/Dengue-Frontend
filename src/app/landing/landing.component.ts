import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  estaLogueado = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.estaLogueado$.subscribe(logueado => {
      this.estaLogueado = logueado;
    });
  }
}
