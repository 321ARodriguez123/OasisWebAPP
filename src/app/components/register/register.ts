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
  user: User = { 
    nombres: '', 
    apellidos: '', 
    identificacion_ci: '', 
    fecha_nacimiento: '', 
    telefono: '', 
    correo: '', 
    contrasena: '' 
  };
  
  confirmPass: string = '';
  termsAccepted: boolean = false; // Nueva variable para el checkbox
  mensaje: string = '';
  exito: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  register() {
    // 1. Validar contraseñas
    if (this.user.contrasena !== this.confirmPass) {
      this.mensaje = 'Las contraseñas no coinciden.';
      this.exito = false;
      return;
    }

    // 2. Validar términos
    if (!this.termsAccepted) {
      this.mensaje = 'Debes aceptar los términos y condiciones.';
      this.exito = false;
      return;
    }

    // 3. Enviar datos
    this.api.register(this.user).subscribe({
      next: () => {
        this.mensaje = '¡Cuenta creada con éxito! Redirigiendo...';
        this.exito = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: any) => {
        this.mensaje = err.error.error || 'Error al registrar el usuario.';
        this.exito = false;
      }
    });
  }
}