/*import { Routes } from '@angular/router';

export const routes: Routes = [];
*/


import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Reservation } from './components/reservation/reservation';
import { Home } from './components/home/home';
import { Profile } from './components/profile/profile';
import { LoginPersonalComponent } from './personal/login-personal/login-personal';
import { AdminGuard } from './guards/admin-guard-guard';
import { PublicLayoutComponent } from './public-layout/public-layout';

export const routes: Routes = [
    //{ path: '', redirectTo: 'login', pathMatch: 'full' }, // Por defecto ir al login

    {   path: '',
        component: PublicLayoutComponent,
        children: [
                {path: '', component: Home},
                { path: 'login', component: Login },
                { path: 'registro', component: Register },
                { path: 'perfil', component: Profile }, // <--- AGREGA ESTA LÍNEA
                { path: 'reservar', component: Reservation },
                { path: 'personal/login', component: LoginPersonalComponent },
        ]

    },

    { 
        path: 'admin',
        loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule),
        canActivate: [AdminGuard] 
    },

    // 2. NUEVA RUTA DE RECEPCIÓN (Rol 102) <--- ESTO SOLUCIONA EL ERROR NG04002
    { 
        path: 'recepcion',
        // Asegúrate de que la ruta de importación sea correcta
        loadChildren: () => import('./recepcion/recepcion-module').then(m => m.RecepcionModule),
        // Opcional: añade RecepcionGuard si lo has creado
    },
];