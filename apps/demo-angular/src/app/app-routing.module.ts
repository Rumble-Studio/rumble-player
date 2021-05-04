import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { SpotifyComponent } from './spotify/spotify.component';

const routes: Routes = [
	{ path: '', component: PlayerComponent },
	{ path: 'spotify', component: SpotifyComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
