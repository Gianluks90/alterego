import { Routes } from '@angular/router';
import { LandingComponent } from './views/landing/landing.component';
import { NotFoundComponent } from './views/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '', component: LandingComponent, pathMatch: 'full',
    },
    {
        path: 'not-found', component: NotFoundComponent, pathMatch: 'full',
    },
    {
        path: '**', redirectTo: 'not-found',
    }
];
