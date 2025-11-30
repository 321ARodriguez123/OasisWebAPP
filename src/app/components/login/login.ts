/*import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

}*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para formularios
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class Login {
  creds = { correo: '', contrasena: '' };
  mensaje = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    this.api.login(this.creds).subscribe({
      next: () => this.router.navigate(['/reservar']),
      error: () => this.mensaje = 'Credenciales incorrectas'
    });
  }
}