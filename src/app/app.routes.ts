
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth/auth-guard.service';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        canActivate: [AuthGuardService],
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);