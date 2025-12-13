// src/app/personal/login-personal/login-personal.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api'; // <-- USAR EL SERVICIO CONSOLIDADO

@Component({
  selector: 'app-login-personal',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login-personal.html', 
})
export class LoginPersonalComponent {
  
  creds = { correo: '', contrasena: '' };
  mensaje = '';
  exito = false; 
  loading = false;

  constructor(private apiService: ApiService, private router: Router) {} // <-- Inyectar ApiService

  login() {
    this.loading = true;
    this.mensaje = ''; 

    this.apiService.loginPersonal(this.creds).subscribe({ // <-- Llamada a la API de personal
      next: (response) => {
        this.loading = false;
        this.mensaje = 'Inicio de sesión exitoso. Redirigiendo...';
        this.exito = true; 
        
        const rolId = response.user.rol_id;
        
        // --- LÓGICA DE REDIRECCIÓN POR ROL ---
        let redirectPath = '/'; 
        if (rolId === 101) {
            redirectPath = '/admin/dashboard'; // ADMINISTRADOR
        } else if (rolId === 102) {
            redirectPath = '/recepcion/dashboard'; // RECEPCIONISTA (Ruta a definir)
        } else {
            this.mensaje = 'Error: Rol de personal desconocido.';
        }

        setTimeout(() => {
            this.router.navigate([redirectPath]);
        }, 1500); 
      },
      error: (err) => {
        this.loading = false;
        this.exito = false;
        
        if (err.status === 401) {
            this.mensaje = 'Credenciales de personal incorrectas.';
        } else {
            this.mensaje = 'Error de conexión con el servidor.';
        }
        console.error('Error de Login:', err);
      }
    });
  }
}