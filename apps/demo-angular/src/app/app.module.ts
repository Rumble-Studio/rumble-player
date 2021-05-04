import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SpotifyComponent } from './spotify/spotify.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	declarations: [AppComponent, PlayerComponent, SpotifyComponent],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatIconModule,
	],
	exports: [PlayerComponent],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
