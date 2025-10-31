import { Routes } from '@angular/router';
import { HomePageComponent } from './views/home-page/home-page.component';
import { AuthPageComponent } from './views/auth-page/auth-page.component';
import { UnsupportedPageComponent } from './views/unsupported-page/unsupported-page.component';

export const routes: Routes = [
    {
        path: '', component: HomePageComponent, pathMatch: 'full',
    },
    {
        path: 'auth/:mode', component: AuthPageComponent, 
    },
    {
        path: 'unsupported', component: UnsupportedPageComponent, 
    },
    {
        path: '**', redirectTo: '',
    }
];
