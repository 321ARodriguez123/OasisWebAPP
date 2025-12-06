/*import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}*/

/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; // Importar RouterModule para que funcionen los links
import { ApiService } from '../../services/api';
import { UserProfile, UserReservation } from '../../models/interfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule], // IMPORTANTE: Agregar RouterModule
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  
  perfil: UserProfile | null = null;
  reservas: UserReservation[] = [];
  cargando: boolean = true;
  mensaje: string = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.cargarDatos();
  }*/

  /*cargarDatos() {
    this.cargando = true;
    console.log("Iniciando carga de perfil...");

    this.api.getUserProfile().subscribe({
      next: (res: any) => {
        console.log("Perfil recibido:", res);
        if (res.success) {
          this.perfil = res.perfil;
          this.reservas = res.reservas || [];
        }
        this.cargando = false;
      },
      error: (err: any) => {
        console.error("Error perfil:", err);
        this.cargando = false;
        
        if (err.status === 401) {
          // Si no hay sesión, volver al login
          this.router.navigate(['/login']);
        } else {
          this.mensaje = 'Error al cargar tus datos. Intenta recargar.';
        }
      }
    });
  }*/
/*cargarDatos() {
  this.cargando = true;
  console.log("Iniciando carga de perfil...");
  this.api.getUserProfile().subscribe({
    next: (res: any) => {
      console.log("Perfil recibido:", res);
      this.perfil = res.perfil;
      this.reservas = res.reservas || [];
      this.cargando = false;
    },
    error: (err: any) => {
      this.cargando = false; // Quitamos el spinner
      
      console.error("Error al cargar perfil:", err);

      // AQUÍ ESTÁ EL CONTROL QUE QUIERES:
      if (err.status === 401) {
        // Si el error es 401, significa que no inició sesión.
        // Lo mandamos a la página de login.
        this.router.navigate(['/login']); // Asegúrate de que esta ruta exista en tu app.routes
      } else {
        // Si es otro error (ej. 500), mostramos un mensaje
        this.mensaje = 'Ocurrió un error inesperado.';
      }
    }
  });
  console.log("Datos de perfil cargados.");
}


  cerrarSesion() {
    this.api.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}*/
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. IMPORTAR ESTO
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; 
import { ApiService } from '../../services/api';
import { UserProfile, UserReservation } from '../../models/interfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  
  perfil: UserProfile | null = null;
  reservas: UserReservation[] = [];
  cargando: boolean = true;
  mensaje: string = '';

  // 2. INYECTAR cd: ChangeDetectorRef EN EL CONSTRUCTOR
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
    console.log("Iniciando carga de perfil...");

    this.api.getUserProfile().subscribe({
      next: (res: any) => {
        console.log("Perfil recibido:", res); // Ya vimos que esto funciona
        
        this.perfil = res.perfil;
        this.reservas = res.reservas || [];
        this.cargando = false;

        // 3. ESTA ES LA CLAVE: OBLIGAR A ACTUALIZAR LA PANTALLA
        this.cd.detectChanges(); 
      },
      error: (err: any) => {
        this.cargando = false;
        console.error("Error al cargar perfil:", err);

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.mensaje = 'Ocurrió un error inesperado al cargar los datos.';
        }
        
        // Aquí también actualizamos por si acaso
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