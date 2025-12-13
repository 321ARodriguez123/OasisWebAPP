// src/app/admin/admin-routing.module.ts

// src/app/admin/admin-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa los componentes que definen las vistas del Admin
import { AdminLayoutComponent } from './admin-layout/admin-layout';
import { DashboardComponent } from './dashboard/dashboard';
import { TiposHabitacionComponent } from './tipos-habitacion/tipos-habitacion';
import { ServiciosComponent } from './servicios/servicios';
import { HabitacionesComponent } from './habitaciones/habitaciones';

const routes: Routes = [
  {
    // Ruta vacía ('') para que cargue la siguiente estructura bajo /admin
    path: '',
    component: AdminLayoutComponent, // Componente contenedor de la sección Admin
    children: [
      // /admin/dashboard
      { path: 'dashboard', component: DashboardComponent },
      
      // /admin/tipos-habitacion (Ruta CRUD)
      { path: 'tipos-habitacion', component: TiposHabitacionComponent },
      
      // /admin/servicios (Ruta CRUD)
      { path: 'servicios', component: ServiciosComponent },
      { path: 'habitaciones', component: HabitacionesComponent },

      // Redirección por defecto: /admin se redirige a /admin/dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }