import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SpotifyComponent } from './spotify/spotify.component';

@NgModule({
	declarations: [AppComponent, PlayerComponent, SpotifyComponent],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		AppRoutingModule,
	],
	exports: [PlayerComponent],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
