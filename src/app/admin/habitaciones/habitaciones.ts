// src/app/admin/habitaciones/habitaciones.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api'; 

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  templateUrl: './habitaciones.html',
  imports: [
    CommonModule, 
    FormsModule,
    DecimalPipe
  ]
})
export class HabitacionesComponent implements OnInit {

  habitaciones: any[] = [];
  tiposHabitacion: any[] = []; 
  caracteristicas: any[] = [];
  
  editandoHabitacion: any = null; 

  // 'piso' se mantiene solo para el cálculo consecutivo en el frontend
  nuevaHabitacion: any = { 
      numero_habitacion: '', 
      tipo_habitacion_id: null, 
      piso: 1, 
      condicion_habitacion: 'habilitado',
      caracteristicas_ids: [] as number[]
  }; 
  
  prefijoPiso: string = 'A'; 

  mensaje: string = '';
  error: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarTiposYCaracteristicas(); 
    this.cargarHabitaciones(true); 
  }

  // --- LÓGICA DE CARGA DE DATOS ---

  cargarTiposYCaracteristicas(): void {
    this.apiService.getAdminCaracteristicas().subscribe({ 
      next: (res: any) => {
        this.caracteristicas = res.caracteristicas;
      },
      error: (err) => {
        this.error = 'Error al cargar características.';
      }
    });

    this.apiService.getAdminRoomTypes().subscribe({ 
      next: (res: any) => {
        this.tiposHabitacion = res.tipos;
      },
      error: (err) => {
        this.error = 'Error al cargar tipos para el selector.';
      }
    });
  }

  cargarHabitaciones(recalcular: boolean = false): void {
    this.apiService.getAdminRoomsInventory().subscribe({ 
      next: (res: any) => {
        this.habitaciones = res.habitaciones.map((h: any) => {
            
            const nombres = Array.isArray(h.caracteristicas_nombres) ? h.caracteristicas_nombres.join(', ') : h.caracteristicas_nombres || 'Ninguna';
            
            return {
                ...h,
                caracteristicas_nombres: nombres,
                tipo_habitacion_id: Number(h.tipo_habitacion_id), 
                caracteristicas_ids: Array.isArray(h.caracteristicas_ids) ? h.caracteristicas_ids.map(Number) : [],
                // Deducir el piso del número de habitación para la vista (Ej: A101 -> 1)
                piso: parseInt(h.numero_habitacion.substring(1, 2)) || 1 
            };
        });
        
        if (recalcular) {
            this.calcularPrefijo(); 
        }
      },
      error: (err) => {
        this.error = 'Error al cargar el inventario de habitaciones.';
        this.mensaje = '';
      }
    });
  }

  // --- LÓGICA DE CÁLCULO CONSECUTIVO ---
  
  private getSiguienteNumeroConsecutivo(piso: number, prefijo: string): string {
      const minRoomNumber = piso * 100 + 1; 

      const numerosHabitacion = this.habitaciones
          .filter(h => h.numero_habitacion.toUpperCase().startsWith(prefijo))
          .map(h => {
              const numStr = h.numero_habitacion.substring(prefijo.length);
              return parseInt(numStr);
          })
          .filter(num => !isNaN(num) && num >= minRoomNumber); 

      let maxNumero = minRoomNumber - 1; 

      if (numerosHabitacion.length > 0) {
          maxNumero = Math.max(...numerosHabitacion);
      }
      
      const siguienteNumero = maxNumero + 1;
      
      return `${prefijo}${siguienteNumero}`;
  }

  calcularPrefijo(): void {
    const pisoNum = Number(this.nuevaHabitacion.piso);
    
    if (isNaN(pisoNum) || pisoNum < 1 || pisoNum > 26) {
        this.prefijoPiso = '';
        this.nuevaHabitacion.numero_habitacion = '';
        return;
    }
    
    this.prefijoPiso = String.fromCharCode(64 + pisoNum);
    this.nuevaHabitacion.numero_habitacion = this.getSiguienteNumeroConsecutivo(pisoNum, this.prefijoPiso);
  }

  // --- LÓGICA DE EDICIÓN ---
  
  iniciarEdicion(habitacion: any): void {
      this.editandoHabitacion = JSON.parse(JSON.stringify(habitacion));
      this.editandoHabitacion.tipo_habitacion_id = Number(this.editandoHabitacion.tipo_habitacion_id); 
      
      this.mensaje = '';
      this.error = '';
  }

  toggleCaracteristicaEdicion(event: any, id: number): void {
      const checked = event.target.checked;
      const idNum = Number(id);

      if (checked) {
          if (!this.editandoHabitacion.caracteristicas_ids.includes(idNum)) {
            this.editandoHabitacion.caracteristicas_ids.push(idNum);
          }
      } else {
          this.editandoHabitacion.caracteristicas_ids = this.editandoHabitacion.caracteristicas_ids.filter((c: number) => c !== idNum);
      }
  }

  guardarEdicion(): void {
    
    const tipoValido = this.editandoHabitacion.tipo_habitacion_id !== null && this.editandoHabitacion.tipo_habitacion_id !== undefined;
    
    if (!tipoValido || !this.editandoHabitacion.condicion_habitacion) {
        this.error = 'Debe completar el tipo y la condición de la habitación.';
        this.mensaje = '';
        return;
    }

    const data = {
        tipo_habitacion_id: this.editandoHabitacion.tipo_habitacion_id,
        condicion_habitacion: this.editandoHabitacion.condicion_habitacion,
        caracteristicas_ids: this.editandoHabitacion.caracteristicas_ids.map(Number)
    };

    this.apiService.updateRoomDetails(this.editandoHabitacion.numero_habitacion, data).subscribe({ 
      next: (res: any) => {
        this.mensaje = `Habitación ${this.editandoHabitacion.numero_habitacion} actualizada exitosamente.`;
        this.error = '';
        this.editandoHabitacion = null; 
        this.cargarHabitaciones(false); 
      },
      error: (err) => {
        this.error = 'Error al actualizar habitación: ' + (err.error?.error || err.message);
        this.mensaje = '';
      }
    });
  }

  cancelarEdicion(): void {
    this.editandoHabitacion = null;
    this.mensaje = '';
    this.error = '';
  }

  // --- LÓGICA DE CREACIÓN Y BORRADO ---

  toggleCaracteristica(event: any, id: number): void {
    const checked = event.target.checked;
    if (checked) {
      this.nuevaHabitacion.caracteristicas_ids.push(id);
    } else {
      this.nuevaHabitacion.caracteristicas_ids = this.nuevaHabitacion.caracteristicas_ids.filter((c: number) => c !== id);
    }
  }

  crearHabitacion(): void {
    // Validamos solo el número, el tipo y que se haya seleccionado el piso para el cálculo.
    if (!this.nuevaHabitacion.tipo_habitacion_id || !this.nuevaHabitacion.numero_habitacion || !this.nuevaHabitacion.piso) {
        this.error = 'Debe completar el número, piso y tipo de habitación.';
        this.mensaje = '';
        return;
    }

    const habitacionData = {
        numero_habitacion: this.nuevaHabitacion.numero_habitacion.toUpperCase(),
        tipo_habitacion_id: this.nuevaHabitacion.tipo_habitacion_id,
        // NO ENVIAMOS 'piso' al backend
        condicion_habitacion: this.nuevaHabitacion.condicion_habitacion,
        caracteristicas_ids: this.nuevaHabitacion.caracteristicas_ids
    };

    this.apiService.createAdminRoomWithDetails(habitacionData).subscribe({ 
      next: (res: any) => {
        this.mensaje = 'Habitación creada exitosamente.';
        this.error = '';
        
        const currentPiso = this.nuevaHabitacion.piso;
        const currentTipoId = this.nuevaHabitacion.tipo_habitacion_id; 

        // Resetear el formulario, manteniendo el piso y el tipo actual por conveniencia
        this.nuevaHabitacion = { 
            numero_habitacion: '', 
            tipo_habitacion_id: currentTipoId, 
            piso: currentPiso, 
            condicion_habitacion: 'habilitado',
            caracteristicas_ids: [] 
        };
        
        this.cargarHabitaciones(true); 
      },
      error: (err) => {
        this.error = 'Error al crear habitación: ' + (err.error?.error || err.message);
        this.mensaje = '';
      }
    });
  }

  eliminarHabitacion(numero: string): void {
    if (confirm(`¿Está seguro de eliminar la habitación ${numero}?`)) {
      this.apiService.deleteAdminRoom(numero).subscribe({ 
        next: (res: any) => {
          this.mensaje = 'Habitación eliminada.';
          this.error = '';
          this.cargarHabitaciones(true);
        },
        error: (err) => {
          this.error = 'No se puede eliminar: ' + (err.error?.error || err.message);
          this.mensaje = '';
        }
      });
    }
  }
  
  cambiarCondicion(habitacion: any): void {
      const condicionActual = habitacion.condicion_habitacion;
      let nuevaCondicion = condicionActual;
      
      if (condicionActual === 'habilitado') {
          nuevaCondicion = 'cerrado';
      } else if (condicionActual === 'cerrado' || condicionActual === 'mantenimiento') {
          nuevaCondicion = 'habilitado';
      } else {
          nuevaCondicion = 'habilitado';
      }

      if (confirm(`¿Cambiar la condición de la habitación ${habitacion.numero_habitacion} de '${condicionActual.toUpperCase()}' a '${nuevaCondicion.toUpperCase()}'?`)) {
          
          this.apiService.updateRoomCondition(habitacion.numero_habitacion, nuevaCondicion).subscribe({
              next: () => {
                  this.mensaje = `Habitación ${habitacion.numero_habitacion} actualizada a ${nuevaCondicion.toUpperCase()}.`;
                  this.error = '';
                  this.cargarHabitaciones();
              },
              error: (err) => {
                  this.error = 'Error al actualizar la condición: ' + (err.error?.error || err.message);
                  this.mensaje = '';
              }
          });
      }
  }
}