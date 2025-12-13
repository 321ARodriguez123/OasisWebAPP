// src/app/recepcion/recepcion.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- SOLUCIONA routerLink
// FormsModule no es necesario si no hay formularios aquí, pero CommonModule cubre el DatePipe.

// Imports de Componentes Standalone
import { RecepcionRoutingModule } from './recepcion-routing-module'; 
import { RecepcionLayoutComponent } from './recepcion-layout/recepcion-layout';
import { DashboardComponent } from './dashboard/dashboard';


@NgModule({
  // 🛑 ELIMINAMOS EL ARREGLO declarations por completo:
  // declarations: [ ], 
  
  imports: [
    CommonModule,     // <-- SOLUCIONA DatePipe
    RouterModule,     // <-- SOLUCIONA routerLink
    RecepcionRoutingModule,
    
    // 🛑 IMPORTAMOS TODOS LOS COMPONENTES STANDALONE AQUÍ:
    RecepcionLayoutComponent,
    DashboardComponent  
  ]
})
export class RecepcionModule { }