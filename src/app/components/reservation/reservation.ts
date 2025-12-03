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
  
  // Datos de Estancia
  stayData = {
    tipo_habitacion_id: '',
    fecha_entrada: '',
    fecha_final: ''
  };

  // Datos del Titular
  titularData = {
    titular_ci: '',
    titular_nombre: '',
    titular_apellido: ''
  };

  // Listas desde BD
  tiposHabitacion: any[] = [];
  servicios: any[] = [];

  // Estado
  disponibilidadVerificada = false;
  habitacionDisponible: any = null;
  totalEstimado = 0;
  mensaje = '';
  exito = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    console.log("Iniciando componente de reservas...");

    // 1. Cargar Tipos de Habitación
    this.api.getRoomTypes().subscribe({
      next: (res: any) => {
        console.log("Tipos recibidos:", res); // Mira la consola para confirmar
        // ASIGNACIÓN CORRECTA: Tu API devuelve { success: true, tipos: [...] }
        this.tiposHabitacion = res.tipos || []; 
      },
      error: (err) => {
        console.error("Error al cargar tipos:", err);
        this.mensaje = 'Error de conexión con el servidor.';
      }
    });

    // 2. Cargar Servicios
    this.api.getServices().subscribe({
      next: (res: any) => {
        this.servicios = (res.servicios || []).map((s: any) => ({
          ...s,
          selected: false,
          cantidad: 1
        }));
      }
    });

    // Pre-llenar usuario si existe
    this.api.user$.subscribe(u => {
      if (u) {
        this.titularData.titular_ci = u.ci || u.identificacion_ci;
        this.titularData.titular_nombre = u.nombre || u.nombres;
      }
    });
  }

  verificarDisponibilidad() {
    this.mensaje = '';
    this.disponibilidadVerificada = false;

    if (!this.stayData.tipo_habitacion_id || !this.stayData.fecha_entrada || !this.stayData.fecha_final) {
      this.mensaje = 'Por favor completa los datos de estancia.';
      this.exito = false;
      return;
    }

    this.api.checkAvailability(this.stayData).subscribe({
      next: (res: any) => {
        if (res.success && res.available) {
          this.disponibilidadVerificada = true;
          this.habitacionDisponible = res.resultado;
          this.recalcularTotalFinal();
          this.mensaje = '¡Habitación Disponible! Continúa con tus datos.';
          this.exito = true;
        } else {
          this.mensaje = 'No hay habitaciones disponibles para esas fechas.';
          this.exito = false;
        }
      },
      error: (err) => {
        this.mensaje = err.error.message || 'Error al verificar disponibilidad.';
        this.exito = false;
      }
    });
  }

  recalcularTotalFinal() {
    if (!this.habitacionDisponible) return;
    
    let total = parseFloat(this.habitacionDisponible.total_estimado);

    this.servicios.forEach(s => {
      if (s.selected) {
        total += (parseFloat(s.precio) * (s.cantidad || 1));
      }
    });

    this.totalEstimado = total;
  }

  confirmarReserva() {
    const serviciosFinales = this.servicios
      .filter(s => s.selected)
      .map(s => ({ id: s.servicio_id, cantidad: s.cantidad }));

    const payload = {
      ...this.stayData,
      numero_habitacion: this.habitacionDisponible.numero_habitacion,
      ...this.titularData,
      servicios: serviciosFinales
    };

    this.api.createReservation(payload).subscribe({
      next: (res: any) => {
        alert(`Reserva Creada! ID: ${res.datos.reserva_id}\nTotal a Pagar: $${res.datos.total}`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.mensaje = err.error.error || 'Error al crear la reserva';
        this.exito = false;
      }
    });
  }
}