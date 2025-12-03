/*import { Component } from '@angular/core';

@Component({
  selector: 'app-reservation',
  imports: [],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css',
})
export class Reservation {

}*/

import { Component, OnInit } from '@angular/core';
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

  // Estado
  isAvailable = false;
  assignedRoom: any = null;
  totalEstimated = 0;
  message = '';
  messageType = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadCatalogs();
  }

  loadCatalogs() {
    this.api.getRoomTypes().subscribe({
      next: (res: any) => { if (res.success) this.roomTypes = res.tipos; },
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
    
    // Validación
    if (!this.searchData.tipo_habitacion_id || !this.searchData.fecha_entrada || !this.searchData.fecha_final) {
      this.showMessage('Por favor completa todos los campos.', 'error');
      return;
    }

    if (this.searchData.numero_huespedes < 1) {
      this.showMessage('Debe haber al menos 1 huésped.', 'error');
      return;
    }

    this.api.checkAvailability(this.searchData).subscribe({
      next: (res: any) => {
        if (res.success && res.available) {
          this.isAvailable = true;
          this.assignedRoom = res.resultado;
          this.recalculateTotal();
          this.showMessage(`¡Disponible! Habitación asignada: ${this.assignedRoom.numero_habitacion}`, 'success');
        } else {
          this.isAvailable = false;
          this.showMessage(res.message || 'No hay habitaciones disponibles.', 'error');
        }
      },
      error: (err) => this.showMessage('Error de conexión.', 'error')
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
          alert(`✅ ¡Reserva Exitosa!\nID: ${res.datos.reserva_id}\nTotal: $${res.datos.total}`);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error(err);
        this.showMessage(err.error.error || 'Error al crear la reserva.', 'error');
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
  }
}