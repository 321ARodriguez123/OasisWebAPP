/*import { Component } from '@angular/core';

@Component({
  selector: 'app-reservation',
  imports: [],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css',
})
export class Reservation {

}*/

import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ⬅️ CAMBIO 1: Importar ChangeDetectorRef
//import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css']
})
export class Reservation implements OnInit {

  // Paso 1: Búsqueda (Incluye Huéspedes)
  searchData = {
    tipo_habitacion_id: '',
    fecha_entrada: '',
    fecha_final: '',
    numero_huespedes: 1 // NUEVO CAMPO
  };

  // Paso 2: Datos del Titular
  holderData = {
    titular_ci: '',
    titular_nombre: '',
    titular_apellido: ''
  };

  // Listas
  roomTypes: any[] = [];
  servicesList: any[] = [];
  isLoading = false;
  // Estado
  isAvailable = false;
  assignedRoom: any = null;
  totalEstimated = 0;
  message = '';
  messageType = '';
noches: number = 0;
reservationResult: any = null;
  //constructor(private api: ApiService, private router: Router) {}
  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.loadCatalogs();
  }

  loadCatalogs() {
    this.api.getRoomTypes().subscribe({
      next: (res: any) => { 
        if (res.success) this.roomTypes = res.tipos; 
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e)
    });

    this.api.getServices().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.servicesList = res.servicios.map((s: any) => ({
            ...s,
            selected: false,
            cantidad: 1
          }));
        }
      },
      error: (e) => console.error(e)
    });
  }

  checkAvailability() {
    this.message = '';
    console.log("consulta enviada");
    // Validación
    if (!this.searchData.tipo_habitacion_id || !this.searchData.fecha_entrada || !this.searchData.fecha_final) {
      this.showMessage('Por favor completa todos los campos.', 'error');
      return;
    }

    if (this.searchData.numero_huespedes < 1) {
      this.showMessage('Debe haber al menos 1 huésped.', 'error');
      return;
    }
    this.isLoading = true;    
    this.isAvailable = false;
    this.api.checkAvailability(this.searchData).subscribe({
      next: (res: any) => {
        
        this.isLoading = false; 
        setTimeout(() => {
          if (res.success && res.available) {
          this.isAvailable = true;
          this.assignedRoom = res.resultado;
          this.recalculateTotal();
          this.noches = res.resultado.noches;
          console.log("Perfil recibido:", res);
          this.showMessage(`¡Disponible! Habitación asignada: ${this.assignedRoom.numero_habitacion}`, 'success');
          this.cdr.detectChanges(); // ⬅️ CAMBIO 2: Forzar detección de cambios
        } else {
          this.isAvailable = false;
          this.showMessage(res.message || 'No hay habitaciones disponibles.', 'error');
        }
        },500);

      },
      error: (err) =>{ 
        this.isLoading = false;
        this.showMessage('Error de conexión.', 'error')
        
      }
    });
  }

  recalculateTotal() {
    if (!this.assignedRoom) return;
    let total = parseFloat(this.assignedRoom.total_estimado_hospedaje || this.assignedRoom.total_estimado);
    this.servicesList.forEach(s => {
      if (s.selected) total += (parseFloat(s.precio) * (s.cantidad || 1));
    });
    this.totalEstimated = total;
  }

  confirmReservation() {
    if (!this.assignedRoom) return;

    if (!this.holderData.titular_ci || !this.holderData.titular_nombre || !this.holderData.titular_apellido) {
      this.showMessage('Por favor completa los datos del titular.', 'error');
      return;
    }

    const selectedServices = this.servicesList
      .filter(s => s.selected)
      .map(s => ({ id: s.servicio_id, cantidad: s.cantidad }));

    const payload = {
      numero_habitacion: this.assignedRoom.numero_habitacion,
      fecha_entrada: this.searchData.fecha_entrada,
      fecha_final: this.searchData.fecha_final,
      numero_huespedes: this.searchData.numero_huespedes, // ENVIAMOS EL DATO AQUÍ
      
      titular_ci: this.holderData.titular_ci,
      titular_nombre: this.holderData.titular_nombre,
      titular_apellido: this.holderData.titular_apellido,

      servicios: selectedServices
    };

    this.api.createReservation(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log("reserva creada: ", res);
          // 🛑 CAMBIO: Almacenar resultado y mostrar mensaje de éxito 
          this.reservationResult = res.datos; // Almacena ID y Total
          this.showMessage('✅ ¡Reserva Exitosa! Revisa el resumen final abajo.', 'success');
        }
      },
      error: (err) => {
        console.error(err);
        this.showMessage(err.error.error || 'Error al crear la reserva.', 'error');
        setTimeout(() => {
              this.router.navigate(['']); // Redirige al inicio
          }, 4000);
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
  }
}