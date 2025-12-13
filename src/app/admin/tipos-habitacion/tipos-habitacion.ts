// src/app/admin/tipos-habitacion/tipos-habitacion.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api'; // Usaremos tu ApiService para las llamadas

// IMPORTA ESTOS:
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-tipos-habitacion',
  standalone: true,
  templateUrl: './tipos-habitacion.html',
  styleUrls: ['./tipos-habitacion.css'],

  // AGREGA ESTO
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe
  ]
})
export class TiposHabitacionComponent implements OnInit {

  tiposHabitacion: any[] = [];
  nuevoTipo = { nombre_tipo: '', descripcion: '', precio_base: 0 };
  editandoTipo: any = null; // Objeto para el modo edición
  mensaje: string = '';
  error: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  // --- LÓGICA CRUD ---

  cargarTiposHabitacion(): void {
    this.apiService.getAdminRoomTypes().subscribe({ // Asumo que crearemos este método en ApiService
      next: (res: any) => {
        this.tiposHabitacion = res.tipos;
      },
      error: (err) => {
        this.error = 'Error al cargar tipos de habitación: ' + err.error.error;
        this.mensaje = '';
        console.error(err);
      }
    });
  }

  crearTipo(): void {
    this.apiService.createAdminRoomType(this.nuevoTipo).subscribe({ // Asumo que crearemos este método
      next: (res: any) => {
        this.mensaje = 'Tipo creado exitosamente.';
        this.error = '';
        this.nuevoTipo = { nombre_tipo: '', descripcion: '', precio_base: 0 }; // Limpiar formulario
        this.cargarTiposHabitacion(); // Recargar la lista
      },
      error: (err) => {
        this.error = 'Error al crear tipo: ' + err.error.error;
        this.mensaje = '';
      }
    });
  }

  iniciarEdicion(tipo: any): void {
    // Clona el objeto para evitar modificar la lista antes de guardar
    this.editandoTipo = { ...tipo }; 
  }

  guardarEdicion(): void {
    if (!this.editandoTipo) return;

    this.apiService.updateAdminRoomType(this.editandoTipo.tipo_habitacion_id, this.editandoTipo).subscribe({ // Asumo que crearemos este método
      next: (res: any) => {
        this.mensaje = 'Tipo actualizado exitosamente.';
        this.error = '';
        this.editandoTipo = null; // Salir del modo edición
        this.cargarTiposHabitacion();
      },
      error: (err) => {
        this.error = 'Error al actualizar: ' + err.error.error;
        this.mensaje = '';
      }
    });
  }

  eliminarTipo(id: number): void {
    if (confirm('¿Está seguro de eliminar este tipo de habitación?')) {
      this.apiService.deleteAdminRoomType(id).subscribe({ // Asumo que crearemos este método
        next: (res: any) => {
          this.mensaje = 'Tipo eliminado.';
          this.error = '';
          this.cargarTiposHabitacion();
        },
        error: (err) => {
          this.error = 'No se puede eliminar: El tipo está en uso. ' + err.error.error;
          this.mensaje = '';
        }
      });
    }
  }
}