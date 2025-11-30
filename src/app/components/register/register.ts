/*import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

}*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class Register {
  user: User = { nombres: '', apellidos: '', identificacion_ci: '', fecha_nacimiento: '', telefono: '', correo: '', contrasena: '' };
  confirmPass = '';
  mensaje = '';
  public errorMessage: string = '';
  constructor(private api: ApiService, private router: Router) {}

  register() {
    if (this.user.contrasena !== this.confirmPass) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }
    this.api.register(this.user).subscribe({
      next: () => {
        alert('Registro exitoso. Inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // 🚨 CAMBIO CLAVE AQUÍ: Lógica para manejar el error 🚨

        let detailedError = 'Error desconocido al registrar.';

        // 1. Intenta capturar el mensaje de error en el formato más común:
        if (err.error && err.error.message) {
          detailedError = err.error.message;
        } 
        // 2. A veces el mensaje de error es solo el objeto 'error'
        else if (err.error && typeof err.error === 'string') {
          detailedError = err.error;
        }
        // 3. Para errores de red o servidor (ej. 500, 503)
        else if (err.status) {
          detailedError = `Error de conexión o servidor: HTTP ${err.status}`;
        }
        
        // Asigna el mensaje detallado a la variable
        this.errorMessage = detailedError; 
        console.error('Error del servidor:', err);
      }
    });
  }
}