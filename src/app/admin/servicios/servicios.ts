// src/app/admin/servicios/servicios.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css'],
  standalone: true,
  imports: [
    CommonModule,   // <-- Habilita *ngIf y *ngFor
    FormsModule,    // <-- Habilita ngModel
    DecimalPipe     // <-- Habilita | number
  ]
})
export class ServiciosComponent implements OnInit {

  servicios: any[] = [];
  nuevoServicio = { nombre_servicio: '', precio: 0, disponibilidad: 'Disponible', descripcion: '' };
  editandoServicio: any = null; 
  mensaje: string = '';
  error: string = '';
  disponibilidades = ['Disponible', 'Limitado', 'Agotado'];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  // --- LÓGICA CRUD ---

  cargarServicios(): void {
    this.apiService.getAdminServices().subscribe({ // Asumo que crearemos este método en ApiService
      next: (res: any) => {
        this.servicios = res.servicios;
      },
      error: (err) => {
        this.error = 'Error al cargar servicios: ' + err.error.error;
        this.mensaje = '';
        console.error(err);
      }
    });
  }

  crearServicio(): void {
    this.apiService.createAdminService(this.nuevoServicio).subscribe({ // Asumo que crearemos este método
      next: (res: any) => {
        this.mensaje = 'Servicio creado exitosamente.';
        this.error = '';
        this.nuevoServicio = { nombre_servicio: '', precio: 0, disponibilidad: 'Disponible', descripcion: '' };
        this.cargarServicios(); 
      },
      error: (err) => {
        this.error = 'Error al crear servicio: ' + err.error.error;
        this.mensaje = '';
      }
    });
  }

  iniciarEdicion(servicio: any): void {
    this.editandoServicio = { ...servicio }; 
  }

  guardarEdicion(): void {
    if (!this.editandoServicio) return;

    this.apiService.updateAdminService(this.editandoServicio.servicio_id, this.editandoServicio).subscribe({ // Asumo que crearemos este método
      next: (res: any) => {
        this.mensaje = 'Servicio actualizado exitosamente.';
        this.error = '';
        this.editandoServicio = null; 
        this.cargarServicios();
      },
      error: (err) => {
        this.error = 'Error al actualizar: ' + err.error.error;
        this.mensaje = '';
      }
    });
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Está seguro de eliminar este servicio?')) {
      this.apiService.deleteAdminService(id).subscribe({ // Asumo que crearemos este método
        next: (res: any) => {
          this.mensaje = 'Servicio eliminado.';
          this.error = '';
          this.cargarServicios();
        },
        error: (err) => {
          this.error = 'No se puede eliminar: El servicio está asociado a reservas. ' + err.error.error;
          this.mensaje = '';
        }
      });
    }
  }
}
