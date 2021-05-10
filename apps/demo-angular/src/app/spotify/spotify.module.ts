import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SpotifyComponent } from './spotify.component';
import { MatSliderModule } from '@angular/material/slider';
import { PlayerComponent } from './player/player.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlaylistItemComponent } from './playlist-item/playlist-item.component';
import { SeekbarComponent } from './seekbar/seekbar.component';
import { ControlComponent } from './control/control.component';
import { ControlMenuComponent } from './control-menu/control-menu.component';
import { LoadDialogComponent } from './load-dialog/load-dialog.component';
import { MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [
		SpotifyComponent,
		PlayerComponent,
		PlaylistComponent,
		PlaylistItemComponent,
		SeekbarComponent,
		ControlComponent,
		ControlMenuComponent,
		LoadDialogComponent,
	],
	imports: [
		CommonModule,
		MatIconModule,
		MatSliderModule,
		MatDialogModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SpotifyModule {}
