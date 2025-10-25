import { Routes } from '@angular/router';
import { LandingComponent } from './views/login/landing.component';

export const routes: Routes = [
    {
        path: '', component: LandingComponent, pathMatch: 'full',
    }
];
