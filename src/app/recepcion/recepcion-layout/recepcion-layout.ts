import { Component } from '@angular/core';

@Component({ // <--- ¡DEBE TENER EL DECORADOR!
  selector: 'app-recepcion-layout',
  templateUrl: './recepcion-layout.html',
  styleUrls: ['./recepcion-layout.css']
})
export class RecepcionLayoutComponent { // <-- DEBE EXPORTAR LA CLASE
  // Lógica del layout de Recepción (menú lateral, etc.)
}
