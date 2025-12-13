import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

// 🚨 MUY IMPORTANTE: Debes importar tu componente de barra de navegación aquí.
// AJUSTA LA RUTA DE ABAJO si tu archivo app-navbar.component.ts está en otro lugar.
import { Navbar } from '../components/navbar/navbar'; 

@Component({
  selector: 'app-public-layout',
  standalone: true, // Asumiendo que usas Standalone Components
  // Incluye el navbar y los módulos necesarios
  imports: [CommonModule, RouterModule, Navbar], 
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css' 
})
export class PublicLayoutComponent {
}