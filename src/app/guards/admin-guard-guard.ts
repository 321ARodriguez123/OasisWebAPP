// src/app/guards/admin-guard.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiService } from '../services/api'; // <-- Usar el ApiService

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) {} // <-- Inyectar ApiService

  canActivate(): Observable<boolean | UrlTree> {
    
    // El Guard usa el servicio para preguntar al backend si el usuario es Admin.
    return this.apiService.checkAdminRole() // <-- Llamada al método de verificación
      .pipe(
        map(response => {
          if (response.success && response.isAdmin) {
            // Es Administrador: Permite el acceso
            return true;
          } else {
            // Bloquea y redirige al login de personal
            return this.router.createUrlTree(['/personal/login']);
          }
        }),
        catchError((error) => {
          // Si hay error (401 No autorizado/Sesión expirada), bloquea y redirige
          return of(this.router.createUrlTree(['/personal/login'])); 
        })
      );
  }
}