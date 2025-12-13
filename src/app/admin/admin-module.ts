// src/app/admin/admin.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';   // <-- SOLUCIONA *ngFor, *ngIf, y Pipes (Date/Number)
import { RouterModule } from '@angular/router';     // <-- SOLUCIONA routerLink, router-outlet
import { FormsModule } from '@angular/forms';       // <-- SOLUCIONA [(ngModel)], ngValue

// Imports de Componentes Standalone
import { AdminRoutingModule } from './admin-routing-module'; 
import { AdminLayoutComponent } from './admin-layout/admin-layout';
import { DashboardComponent } from './dashboard/dashboard';
import { TiposHabitacionComponent } from './tipos-habitacion/tipos-habitacion';
import { ServiciosComponent } from './servicios/servicios';


@NgModule({
  // 🛑 ELIMINAMOS EL ARREGLO declarations por completo para los standalone:
  // declarations: [ ... ], 
  
  imports: [
    CommonModule,     
    RouterModule,     
    FormsModule,      // <-- CLAVE PARA LOS FORMULARIOS CRUD
    AdminRoutingModule,
    
    // 🛑 IMPORTAMOS TODOS LOS COMPONENTES STANDALONE AQUÍ:
    AdminLayoutComponent,
    DashboardComponent,
    TiposHabitacionComponent,
    ServiciosComponent
  ]
})
export class AdminModule { }