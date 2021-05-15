import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  MatIconModule } from '@angular/material/icon';
import { SpotifyModule } from './spotify/spotify.module';
import { SpotifyComponent } from './spotify/spotify.component';


const routes: Routes = [
	{ path: '', component: SpotifyComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    SpotifyModule,
    MatIconModule
  ],
	exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule {}
