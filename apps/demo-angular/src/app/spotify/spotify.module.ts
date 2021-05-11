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
import {
	MAT_DIALOG_DATA,
	MatDialogClose,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import {
	BrowserAnimationsModule,
	NoopAnimationsModule,
} from '@angular/platform-browser/animations';

@NgModule({
	declarations: [
		PlayerComponent,
		PlaylistComponent,
		PlaylistItemComponent,
		SeekbarComponent,
		ControlComponent,
		ControlMenuComponent,
		LoadDialogComponent,
		SpotifyComponent,
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
		MatIconTestingModule,
		BrowserAnimationsModule,
		NoopAnimationsModule,
	],
	exports: [PlaylistItemComponent, PlaylistComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	providers: [
		{
			provide: MatDialogRef,
			useValue: {},
		},
		{
			provide: MAT_DIALOG_DATA,
			useValue: {},
		},
	],
})
export class SpotifyModule {}
