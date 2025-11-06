import { Routes } from '@angular/router';
import { HomePageComponent } from './views/home-page/home-page.component';
import { AuthPageComponent } from './views/auth-page/auth-page.component';
import { UnsupportedPageComponent } from './views/unsupported-page/unsupported-page.component';
import { MissionsListPageComponent } from './views/missions-list-page/missions-list-page.component';
import { MissionLobbyPageComponent } from './views/mission-lobby-page/mission-lobby-page.component';
import { CodexPageComponent } from './views/codex-page/codex-page.component';

export const routes: Routes = [
    {
        path: '', component: HomePageComponent, pathMatch: 'full',
    },
    {
        path: 'auth/:mode', component: AuthPageComponent, 
    },
    {
        path: 'missions', component: MissionsListPageComponent,
    },
    {
        path: 'missions/:id/lobby', component: MissionLobbyPageComponent,
    },
    {
        path: 'codex', component: CodexPageComponent,
    },
    {
        path: 'unsupported', component: UnsupportedPageComponent, 
    },
    {
        path: '**', redirectTo: '',
    }
];
