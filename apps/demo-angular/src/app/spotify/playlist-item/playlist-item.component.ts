import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from '@angular/core';
import { PlayerBridgeService } from '../player-bridge.service';
import { Song } from '@rumble-player/service';

@Component({
	selector: 'rumble-player-playlist-item',
	templateUrl: './playlist-item.component.html',
	styleUrls: ['./playlist-item.component.scss'],
})
export class PlaylistItemComponent implements AfterViewInit {
	@ViewChild('container') container: ElementRef<HTMLDivElement> | undefined;

	@Input() index: number;
	@Input() song: Song = {
		title: '',
		file: '',
		id: '',
		valid: false,
		loaded: false,
		duration: 0,
		howl: null,
		image: '',
		author: '',
		albumArt: '',
		playlistName: '',
		position: null,
	};
	@Input() header: boolean;
	constructor(public bridge: PlayerBridgeService) {}

	public secondesTo(timestamp: number) {
		const hours = Math.floor(timestamp / 60 / 60);
		const minutes = Math.floor(timestamp / 60) - hours * 60;
		const seconds = timestamp % 60;

		const formatted =
			hours.toFixed(0).padStart(2, '0') +
			':' +
			minutes.toFixed(0).padStart(2, '0') +
			':' +
			seconds.toFixed(0).padStart(2, '0');

		return formatted;
	}
	onPlay() {
		if (this.bridge.playerService.isPlaying) {
			if (this.bridge.playerService.index === this.index) {
				this.bridge.playerHTML.pause({ index: this.index });
			} else {
				this.bridge.playerHTML.stop();
				this.bridge.playerHTML.play({ index: this.index });
			}
		} else {
			this.bridge.playerHTML.play({ index: this.index });
		}
	}
	ngAfterViewInit() {
		if (this.container) {
			this.bridge.playerHTML.addEventListener(
				'play',
				(paylaod: CustomEvent) => {
					if (paylaod.detail.index === this.index) {
						const icon = this.container.nativeElement.querySelector(
							'mat-icon'
						);
						icon.textContent = 'pause_circle_outline';
					}
				}
			);
			this.bridge.playerHTML.addEventListener(
				'pause',
				(paylaod: CustomEvent) => {
					const icon = this.container.nativeElement.querySelector(
						'mat-icon'
					);
					icon.textContent = 'play_circle_outline';
				}
			);
		}
	}
}
