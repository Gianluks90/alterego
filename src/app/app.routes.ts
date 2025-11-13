import { Routes } from '@angular/router';
import { HomePageComponent } from './views/home-page/home-page.component';
import { AuthPageComponent } from './views/auth-page/auth-page.component';
import { UnsupportedPageComponent } from './views/unsupported-page/unsupported-page.component';
import { MissionsListPageComponent } from './views/missions-list-page/missions-list-page.component';
import { MissionLobbyPageComponent } from './views/mission-lobby-page/mission-lobby-page.component';
import { CodexPageComponent } from './views/codex-page/codex-page.component';
import { lobbyResolver } from './resolvers/lobby.resolver';
import { AuthGuardService } from './services/auth-guard.service';
import { soundResolver } from './resolvers/sound.resolver';
import { codexResolver } from './resolvers/codex.resolver';
import { missionPlayResolver } from './resolvers/mission-play.resolver';

export const routes: Routes = [
    {
        title: 'Home',
        path: '',
        loadComponent: () => import('./views/home-page/home-page.component').then(m => m.HomePageComponent), 
        pathMatch: 'full',
        resolve: {
            resolved: soundResolver
        },
    },
    {
        title: 'Authentication',
        path: 'auth/:mode',
        loadComponent: () => import('./views/auth-page/auth-page.component').then(m => m.AuthPageComponent),
    },
    {
        title: 'Missions',
        path: 'missions', 
        loadComponent: () => import('./views/missions-list-page/missions-list-page.component').then(m => m.MissionsListPageComponent),
        canActivate: [AuthGuardService]
    },
    {
        title: 'Mission Lobby',
        path: 'missions/:id/lobby', 
        loadComponent: () => import('./views/mission-lobby-page/mission-lobby-page.component').then(m => m.MissionLobbyPageComponent),
        resolve: {
            resolved: lobbyResolver
        },
        canActivate: [AuthGuardService]
    },
    {
        title: 'Mission',
        path: 'missions/:id/play', 
        loadComponent: () => import('./views/mission-play-page/mission-play-page.component').then(m => m.MissionPlayPageComponent),
        resolve: {
            resolved: missionPlayResolver
        },
        canActivate: [AuthGuardService],
    },
    {
        title: 'Codex',
        path: 'codex',
        loadComponent: () => import('./views/codex-page/codex-page.component').then(m => m.CodexPageComponent),
        resolve: {
            resolved: codexResolver,
        },
        canActivate: [AuthGuardService]
    },
    {
        path: 'unsupported',
        loadComponent: () => import('./views/unsupported-page/unsupported-page.component').then(m => m.UnsupportedPageComponent), 
    },
    {
        path: '**', redirectTo: '',
    }
];
