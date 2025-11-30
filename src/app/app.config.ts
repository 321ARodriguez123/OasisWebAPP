/*import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
*/


// src/app/app.config.ts
/*import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // O app-routing.module
import { provideHttpClient, withFetch } from '@angular/common/http'; // <--- AGREGA ESTO

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()) // <--- AGREGA ESTO AQUÍ
  ]
};

*/

// src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importa 'provideHttpClient' y, crucialmente, 'withFetch'
import { provideHttpClient, withFetch } from '@angular/common/http'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // 💡 APLICAR EL FIX AQUÍ: 
    // Añade el método withFetch() dentro de provideHttpClient()
    provideHttpClient(
      withFetch() // <-- Esto soluciona la advertencia NG02801
    ),
    // ... otros providers (servicios) que puedas tener
  ]
};