import { Routes } from '@angular/router';
import { HomePageComponent } from './views/home-page/home-page.component';
import { AuthPageComponent } from './views/auth-page/auth-page.component';
import { UnsupportedPageComponent } from './views/unsupported-page/unsupported-page.component';
import { GamesListPageComponent } from './views/games-list-page/games-list-page.component';
import { GameLobbyPageComponent } from './views/game-lobby-page/game-lobby-page.component';

export const routes: Routes = [
    {
        path: '', component: HomePageComponent, pathMatch: 'full',
    },
    {
        path: 'auth/:mode', component: AuthPageComponent, 
    },
    {
        path: 'games', component: GamesListPageComponent,
    },
    {
        path: 'games/:id/lobby', component: GameLobbyPageComponent,
    },
    {
        path: 'unsupported', component: UnsupportedPageComponent, 
    },
    {
        path: '**', redirectTo: '',
    }
];
