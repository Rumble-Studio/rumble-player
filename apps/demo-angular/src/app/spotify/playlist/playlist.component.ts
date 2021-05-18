import {
	AfterViewInit,
	Component,
	ElementRef,
	ViewChild,
} from '@angular/core';
import { PlayerBridgeService } from '../player-bridge.service';

@Component({
	selector: 'rumble-player-playlist',
	templateUrl: './playlist.component.html',
	styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements AfterViewInit {
	defaultImage =
		'https://i.scdn.co/image/ab67706f00000003c414e7daf34690c9f983f76e';
	image: string;
	@ViewChild('header') header: ElementRef<HTMLDivElement> | undefined;
	@ViewChild('header2') header2: ElementRef<HTMLDivElement> | undefined;

	isHome = true;

	constructor(public bridge: PlayerBridgeService) {}

	ngAfterViewInit() {
		if (this.header) {
			this.bridge.playerHTML.addEventListener('newPlaylist', () => {
				if (this.bridge.playerService.playlist[1].albumArt) {
					const icon = this.header.nativeElement.querySelector('img');
					this.image = this.bridge.playerService.playlist[1].albumArt;
					icon.setAttribute('src', this.image);
				} else {
					const icon = this.header.nativeElement.querySelector('img');
					this.image = this.defaultImage;
					icon.setAttribute('src', this.image);
				}
			});
		}
	}
}
