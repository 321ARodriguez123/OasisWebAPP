// src/app/principal/principal.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf
import { FormsModule } from '@angular/forms';   // Para [(ngModel)]

import { Api, ApiResponse } from '../services/api'; 

@Component({
  selector: 'app-principal',
  standalone: true, // Asumimos Standalone Component
  imports: [CommonModule, FormsModule], 
  templateUrl: './principal.html', 
  styleUrls: ['./principal.css'] 
})
export class PrincipalComponent implements OnInit {
  
  // Propiedades para el formulario de Login
  loginData = { correo: '', contrasena: '' };
  
  // Propiedades de estado para el mensaje (CRÍTICO para el HTML)
  loginMessage: string | null = null;
  isLoginSuccess: boolean = false; 

  // Inyección de servicios: SOLO 'Api'
  constructor(
    private api: Api // Inyección de la clase 'Api'
  ) {}

  ngOnInit(): void {}
  
  // --- MÉTODO DE ACCIÓN DE LOGIN ---

  onLogin() {
    this.loginMessage = 'Verificando correo...';
    this.isLoginSuccess = false; 

    this.api.login(this.loginData).subscribe((response: ApiResponse) => {
      this.loginMessage = (response.message || response.error) || null;
      this.isLoginSuccess = response.success; 
      
      if (response.success) {
        this.loginData.contrasena = ''; 
      }
    });
  }
}