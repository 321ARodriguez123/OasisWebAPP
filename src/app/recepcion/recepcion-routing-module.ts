// src/app/recepcion/recepcion-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 🛑 CLAVE: Importa los componentes para usarlos en el array 'routes'
import { RecepcionLayoutComponent } from './recepcion-layout/recepcion-layout';
import { DashboardComponent } from './dashboard/dashboard'; 

const routes: Routes = [
  {
    path: '', 
    component: RecepcionLayoutComponent, // Componente contenedor de la sección
    children: [
      { path: 'dashboard', component: DashboardComponent }, // /recepcion/dashboard
      // Aquí irían otras rutas como 'check-in' o 'facturas'
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  // 🛑 CLAVE: Este archivo DEBE EXPORTAR la clase del módulo de routing
  exports: [RouterModule]
})
export class RecepcionRoutingModule { }