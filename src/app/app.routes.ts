import { Routes } from '@angular/router';
import { HomePageComponent } from './views/home-page/home-page.component';
import { AuthPageComponent } from './views/auth-page/auth-page.component';
import { UnsupportedPageComponent } from './views/unsupported-page/unsupported-page.component';
import { MissionsListPageComponent } from './views/missions-list-page/missions-list-page.component';
import { MissionLobbyPageComponent } from './views/mission-lobby-page/mission-lobby-page.component';
import { CodexPageComponent } from './views/codex-page/codex-page.component';
import { lobbyResolver } from './resolvers/lobby.resolver';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
    {
        title: 'Home',
        path: '', component: HomePageComponent, 
        pathMatch: 'full',
    },
    {
        title: 'Authentication',
        path: 'auth/:mode', component: AuthPageComponent,
    },
    {
        title: 'Missions',
        path: 'missions', component: MissionsListPageComponent, 
        canActivate: [AuthGuardService]
    },
    {
        title: 'Mission Lobby',
        path: 'missions/:id/lobby', component: MissionLobbyPageComponent,
        resolve: {
            resolved: lobbyResolver
        },
        canActivate: [AuthGuardService]
    },
    {
        title: 'Codex',
        path: 'codex', component: CodexPageComponent,
        resolve: {
            resolved: lobbyResolver
        },
        canActivate: [AuthGuardService]
    },
    {
        path: 'unsupported', component: UnsupportedPageComponent, 
    },
    {
        path: '**', redirectTo: '',
    }
];
