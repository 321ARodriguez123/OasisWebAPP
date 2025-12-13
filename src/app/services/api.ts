// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; 
  
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true 
  };

  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getUserFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const u = localStorage.getItem('user_profile');
      return u ? JSON.parse(u) : null;
    }
    return null;
  }

  // Auth
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user, this.httpOptions);
  }

  login(creds: {correo: string, contrasena: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, creds, this.httpOptions).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem('user_profile', JSON.stringify(res.user));
          this.userSubject.next(res.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, this.httpOptions).pipe(
      tap(() => {
        localStorage.removeItem('user_profile');
        this.userSubject.next(null);
      })
    );
  }

  // Datos
  /*
  getRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/habitaciones`, this.httpOptions);
  }

  getServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/servicios`, this.httpOptions);
  }

  createReservation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservas/crear`, data, this.httpOptions);
  }*/

  // --- RESERVAS (Rutas Actualizadas) ---
  
  // 1. Obtener Tipos de Habitación
  getRoomTypes(): Observable<any> {
    // Coincide con: router.get('/habitaciones/tipos', ...)
    return this.http.get(`${this.apiUrl}/habitaciones/tipos`, this.httpOptions);
  }

  // 1.5 Obtener Servicios
  getServices(): Observable<any> {
    // CORREGIDO: Coincide con router.get('/habitaciones/servicios', ...)
    return this.http.get(`${this.apiUrl}/habitaciones/servicios`, this.httpOptions);
  }
getUserProfile() {
  // Tienes que agregar { withCredentials: true } explícitamente
  return this.http.get(`${this.apiUrl}/usuario/perfil`, { withCredentials: true });
}



  // 2. Verificar Disponibilidad
  checkAvailability(data: any): Observable<any> {
    // CORREGIDO: Coincide con router.post('/reservas/buscar', ...)
    return this.http.post(`${this.apiUrl}/reservas/buscar`, data, this.httpOptions);
  }

  // 3. Crear Reserva Final
  createReservation(data: any): Observable<any> {
    // Coincide con: router.post('/reservas/crear', ...)
    return this.http.post(`${this.apiUrl}/reservas/crear`, data, this.httpOptions);
  }
  cancelReservation(reservaId: number | string): Observable<any> {
    // Coincide con: DELETE /api/reservas/:id
    return this.http.delete(`${this.apiUrl}/reservas/${reservaId}`, this.httpOptions);
  }
 
  updateProfile(data: { nombres: string, apellidos: string, correo: string, telefono: string }): Observable<any> {
    // Usamos this.apiUrl para construir la URL base
    const url = `${this.apiUrl}/usuario/perfil`; // Asumo un endpoint como /api/usuario/perfil para PATCH
    
    // El método PATCH es común para actualizaciones parciales
    // Incluimos this.httpOptions que ya contiene los headers y withCredentials: true
    return this.http.patch(url, data, this.httpOptions); 
  }

  //personal
  loginPersonal(creds: {correo: string, contrasena: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/personal/login`, creds, this.httpOptions);
  }
  checkAdminRole(): Observable<{ success: boolean, isAdmin: boolean }> {
      return this.http.get<{ success: boolean, isAdmin: boolean }>(`${this.apiUrl}/auth/check-admin`, this.httpOptions);
  }

  // IV. ADMINISTRACIÓN (CRUD PROTEGIDO)
  // ==========================================================

  // --- TIPOS DE HABITACIÓN ---
  getAdminRoomTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/tipos-habitacion`, this.httpOptions);
  }
  createAdminRoomType(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/tipos-habitacion`, data, this.httpOptions);
  }
  updateAdminRoomType(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/tipos-habitacion/${id}`, data, this.httpOptions);
  }
  deleteAdminRoomType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/tipos-habitacion/${id}`, this.httpOptions);
  }

  // --- SERVICIOS ---
  getAdminServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/servicios`, this.httpOptions);
  }
  createAdminService(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/servicios`, data, this.httpOptions);
  }
  updateAdminService(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/servicios/${id}`, data, this.httpOptions);
  }
  deleteAdminService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/servicios/${id}`, this.httpOptions);
  }







  /**/ 
updateRoomDetails(numeroHabitacion: string, data: any): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/admin/habitaciones/${numeroHabitacion}`,
    data,
    this.httpOptions
  );
}


/**
   * 🚨 1. SOLUCIÓN para 'getAdminCaracteristicas'
   * Obtiene la lista de características adicionales de la BD (Balcón, Jacuzzi, etc.)
   */
  getAdminCaracteristicas(): Observable<any> {
    // AÑADIDO: this.httpOptions
    return this.http.get(`${this.apiUrl}/admin/caracteristicas`, this.httpOptions);
  }

  /**
   * 🚨 2. SOLUCIÓN para 'getAdminRoomsInventory'
   * Obtiene el inventario de habitaciones (A101, B205, etc.) con sus detalles (tipo, características).
   */
  getAdminRoomsInventory(): Observable<any> {
    // AÑADIDO: this.httpOptions
    return this.http.get(`${this.apiUrl}/admin/habitaciones/inventario`, this.httpOptions);
  }

  /**
   * 🚨 3. SOLUCIÓN para 'createAdminRoomWithDetails'
   * Crea una nueva habitación física, incluyendo su tipo y las características seleccionadas.
   */
  createAdminRoomWithDetails(habitacionData: any): Observable<any> {
    // AÑADIDO: this.httpOptions
    return this.http.post(`${this.apiUrl}/admin/habitaciones`, habitacionData, this.httpOptions);
  }

  /**
   * 🚨 4. SOLUCIÓN para 'deleteAdminRoom'
   * Elimina una habitación física por su número (ya que es la llave primaria en la BD).
   */
  deleteAdminRoom(numeroHabitacion: string): Observable<any> {
    // AÑADIDO: this.httpOptions
    return this.http.delete(`${this.apiUrl}/admin/habitaciones/${numeroHabitacion}`, this.httpOptions);
  }

  // 🚨 NUEVO MÉTODO PARA CAMBIAR CONDICIÓN
  updateRoomCondition(numeroHabitacion: string, nuevaCondicion: string): Observable<any> {
    // AÑADIDO: this.httpOptions
    return this.http.put(`${this.apiUrl}/admin/habitaciones/${numeroHabitacion}/condicion`, { 
        condicion_habitacion: nuevaCondicion 
    }, this.httpOptions);
  }




  


}
