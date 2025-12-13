// src/app/recepcion/dashboard/dashboard.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]   // <--- NECESARIO PARA QUE FUNCIONE routerLink
})
export class DashboardComponent { 

  currentDate: Date = new Date();
}

