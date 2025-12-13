// src/app/admin/admin-layout/admin-layout.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'],
  imports: [CommonModule, RouterModule], 
})
export class AdminLayoutComponent {
  // Lista de rutas CRUD para el Admin
  menuItems = [
    { name: 'Inicio', link: '/admin/dashboard' },
    { name: 'Tipos de Habitación', link: '/admin/tipos-habitacion' }, // Ruta CRUD
    { name: 'Servicios Adicionales', link: '/admin/servicios' },     // Ruta CRUD
    //{ name: 'Usuarios', link: '/admin/usuarios' }
  ];
}