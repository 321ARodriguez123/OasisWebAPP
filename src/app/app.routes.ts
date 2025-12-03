/*import { Routes } from '@angular/router';

export const routes: Routes = [];
*/


import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Reservation } from './components/reservation/reservation';
import { Home } from './components/home/home';

export const routes: Routes = [
    //{ path: '', redirectTo: 'login', pathMatch: 'full' }, // Por defecto ir al login
    {path: '', component: Home},
    { path: 'login', component: Login },
    { path: 'registro', component: Register },
    { path: 'reservar', component: Reservation },
];