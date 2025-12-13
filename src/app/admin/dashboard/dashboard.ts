// src/app/admin/dashboard/dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,                  // ✅ necesario si es standalone
  imports: [CommonModule, RouterModule]  // ✅ RouterModule para routerLink
})
export class DashboardComponent { 
    adminName: string = 'Adrián';  // ✅ agrega esta línea

}
