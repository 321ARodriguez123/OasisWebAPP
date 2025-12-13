

// src/app/components/profile/profile.ts
/*
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; 
import { ApiService } from '../../services/api'; 
import { UserProfile, UserReservation } from '../../models/interfaces'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css' // Usando el archivo CSS separado
})
export class Profile implements OnInit {
  
  perfil: UserProfile | null = null;
  reservas: UserReservation[] = [];
  cargando: boolean = true;
  cancelando: boolean = false; 
  mensaje: string = '';

  // Variables para el modal de confirmación
  mostrarModalConfirm: boolean = false;
  reservaIdABorrar: number | string | null = null;

  constructor(
    private api: ApiService, 
    private router: Router,
    private cd: ChangeDetectorRef // Necesario para asegurar la actualización de la vista
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.mensaje = '';
    
    this.api.getUserProfile().subscribe({
      next: (res: any) => {
        this.perfil = res?.perfil ?? null;
        this.reservas = Array.isArray(res?.reservas) ? res.reservas : [];
        this.cargando = false;
        this.cd.detectChanges(); 
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error al cargar perfil:', err);
        
        if (err?.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.mensaje = '❌ Error al cargar datos. Intenta recargar.';
        }
        this.cd.detectChanges(); 
      }
    });
  }

  // --- Lógica de Cancelación de Reserva ---

  // Abre el modal de confirmación
  abrirModalConfirm(reservaId: number | string) {
    this.reservaIdABorrar = reservaId;
    this.mostrarModalConfirm = true;
    this.mensaje = ''; 
    this.cd.detectChanges();
  }

  // Cierra el modal sin hacer nada
  cerrarModalConfirm() {
    this.mostrarModalConfirm = false;
    this.reservaIdABorrar = null;
    this.cancelando = false; 
    this.cd.detectChanges();
  }

  // Confirma y CANCELA la reserva (Llama al backend)
  confirmarBorrar() {
    if (!this.reservaIdABorrar) {
      this.mensaje = '❌ ID de reserva inválido.';
      this.cerrarModalConfirm();
      return;
    }

    this.mostrarModalConfirm = false; 
    this.cancelando = true; 
    this.mensaje = '⏳ Cancelando reserva...';
    this.cd.detectChanges();

    this.api.cancelReservation(this.reservaIdABorrar).subscribe({
      next: (res: any) => {
        // Actualizar el estado localmente para reflejar el cambio (marcar como 'Cancelada')
        const idToCancel = this.reservaIdABorrar;
        this.reservas = this.reservas.map(r => 
          r.reserva_id == idToCancel ? { ...r, estado: 'Cancelada' } : r
        );
        
        this.mensaje = '✅ Reserva cancelada correctamente.';
        this.cancelando = false;
        this.reservaIdABorrar = null;
        
        this.cd.detectChanges();
        
        setTimeout(() => {
          this.mensaje = '';
          this.cd.detectChanges();
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error al cancelar reserva:', err);
        this.mensaje = `❌ No se pudo cancelar la reserva: ${err.error?.error || 'Error de conexión'}`;
        this.cancelando = false;
        this.cd.detectChanges();
      }
    });
  }

  cerrarSesion() {
    this.api.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
*/

// src/app/components/profile/profile.ts (Actualizado)

import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { ApiService } from '../../services/api'; 
import { UserProfile, UserReservation } from '../../models/interfaces'; 
import { ProfileEditComponent } from '../profile-edit/profile-edit'; // <--- ¡NUEVA IMPORTACIÓN!

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProfileEditComponent], // <--- AÑADIDO ProfileEditComponent
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  
  perfil: UserProfile | null = null;
  reservas: UserReservation[] = [];
  cargando: boolean = true;
  cancelando: boolean = false; 
  mensaje: string = '';

  // Variables de edición simplificadas
  editandoPerfil: boolean = false;
  guardandoPerfil: boolean = false;
  // Ya no necesitamos las variables de formulario aquí, el componente hijo las maneja

  // Variables para el modal de confirmación
  mostrarModalConfirm: boolean = false;
  reservaIdABorrar: number | string | null = null;

  constructor(
    private api: ApiService, 
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.mensaje = '';
    
    this.api.getUserProfile().subscribe({
      next: (res: any) => {
        this.perfil = res?.perfil ?? null;
        this.reservas = Array.isArray(res?.reservas) ? res.reservas : [];
        this.cargando = false;
        this.cd.detectChanges(); 
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error al cargar perfil:', err);
        
        if (err?.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.mensaje = '❌ Error al cargar datos. Intenta recargar.';
        }
        this.cd.detectChanges(); 
      }
    });
  }
  
  // --- Lógica de Edición de Perfil (Simplificada) ---

  editarPerfil() {
    this.editandoPerfil = true;
    this.mensaje = ''; // Limpiar mensajes
    this.cd.detectChanges();
  }

  cancelarEdicion() {
    this.editandoPerfil = false;
    this.guardandoPerfil = false;
    this.mensaje = '';
    this.cd.detectChanges();
  }

  // Recibe los datos del componente hijo para guardarlos
  guardarPerfil(datosActualizados: { nombres: string, apellidos: string, correo: string, telefono: string }) {
    if (!this.perfil) return;
    
    this.guardandoPerfil = true;
    this.mensaje = '⏳ Guardando cambios...';
    this.cd.detectChanges();

    this.api.updateProfile(datosActualizados).subscribe({
      next: (res: any) => {
        // Actualizar el perfil localmente
        this.perfil = {
          ...this.perfil!,
          ...datosActualizados,
        };

        this.mensaje = '✅ Perfil actualizado correctamente.';
        this.editandoPerfil = false; // Sale del modo edición
        this.guardandoPerfil = false;
        this.cd.detectChanges();

        setTimeout(() => {
          this.mensaje = '';
          this.cd.detectChanges();
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error al guardar perfil:', err);
        this.mensaje = `❌ Error al actualizar: ${err.error?.error || 'Error de conexión'}`;
        this.guardandoPerfil = false;
        this.cd.detectChanges();
      }
    });
  }

  // --- Lógica de Cancelación de Reserva y cerrarSesion (sin cambios) ---
  
  abrirModalConfirm(reservaId: number | string) {
    this.reservaIdABorrar = reservaId;
    this.mostrarModalConfirm = true;
    this.mensaje = ''; 
    this.cd.detectChanges();
  }

  cerrarModalConfirm() {
    this.mostrarModalConfirm = false;
    this.reservaIdABorrar = null;
    this.cancelando = false; 
    this.cd.detectChanges();
  }

  confirmarBorrar() {
    if (!this.reservaIdABorrar) {
      this.mensaje = '❌ ID de reserva inválido.';
      this.cerrarModalConfirm();
      return;
    }

    this.mostrarModalConfirm = false; 
    this.cancelando = true; 
    this.mensaje = '⏳ Cancelando reserva...';
    this.cd.detectChanges();

    this.api.cancelReservation(this.reservaIdABorrar).subscribe({
      next: (res: any) => {
        const idToCancel = this.reservaIdABorrar;
        this.reservas = this.reservas.map(r => 
          r.reserva_id == idToCancel ? { ...r, estado: 'Cancelada' } : r
        );
        
        this.mensaje = '✅ Reserva cancelada correctamente.';
        this.cancelando = false;
        this.reservaIdABorrar = null;
        
        this.cd.detectChanges();
        
        setTimeout(() => {
          this.mensaje = '';
          this.cd.detectChanges();
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error al cancelar reserva:', err);
        this.mensaje = `❌ No se pudo cancelar la reserva: ${err.error?.error || 'Error de conexión'}`;
        this.cancelando = false;
        this.cd.detectChanges();
      }
    });
  }

  cerrarSesion() {
    this.api.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}