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
  templateUrl: './reservation.html'
})
export class Reservation implements OnInit {
  formData = { numero_habitacion: '', fecha_entrada: '', fecha_salida: '', numero_huespedes: 1 };
  habitaciones: any[] = [];
  servicios: any[] = [];
  total = 0;
  mensaje = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getRooms().subscribe(res => this.habitaciones = res.rooms);
    this.api.getServices().subscribe(res => {
        this.servicios = res.services.map((s:any) => ({...s, selected: false, quantity: 1}));
    });
  }

  calcTotal() {
    const room = this.habitaciones.find(h => h.numero_habitacion == this.formData.numero_habitacion);
    if (!room || !this.formData.fecha_entrada || !this.formData.fecha_salida) return;

    const days = Math.ceil((new Date(this.formData.fecha_salida).getTime() - new Date(this.formData.fecha_entrada).getTime()) / (1000 * 3600 * 24));
    
    if (days > 0) {
      this.total = (room.precio_base * days) + this.servicios.reduce((acc, s) => s.selected ? acc + (s.precio * s.quantity) : acc, 0);
    }
  }

  reservar() {
    const payload = {
        ...this.formData,
        servicios: this.servicios.filter(s => s.selected).map(s => ({id: s.servicio_id, cantidad: s.quantity}))
    };
    this.api.createReservation(payload).subscribe({
        next: () => { alert('¡Reserva confirmada!'); this.router.navigate(['/']); },
        error: (e) => this.mensaje = e.error.error || 'Error al reservar'
    });
  }
}