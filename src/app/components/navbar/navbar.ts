/*import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

}*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngIf
import { RouterModule, Router } from '@angular/router'; // Para usar routerLink
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class Navbar {
  user: any = null;

  constructor(public api: ApiService, private router: Router) {
    this.api.user$.subscribe(u => this.user = u);
  }

  logout() {
    this.api.logout().subscribe(() => this.router.navigate(['/login']));
  }
}