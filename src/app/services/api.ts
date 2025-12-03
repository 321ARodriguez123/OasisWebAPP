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
}