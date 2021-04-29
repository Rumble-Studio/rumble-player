import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [AppComponent, PlayerComponent],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule.forRoot([], { initialNavigation: 'enabled' }),
	],
	exports: [PlayerComponent],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
