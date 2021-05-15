import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import { PlayerBridgeService } from '../player-bridge.service';
import { Song } from '@rumble-player/player';

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
		if (this.bridge.playing.getValue()) {
			if (this.bridge.index.getValue() === this.index) {
				this.bridge.pause({ index: this.index });
			} else {
				this.bridge.stop();
				this.bridge.play(this.index);
			}
		} else {
			this.bridge.play(this.index);
		}
	}
	ngAfterViewInit() {
		if (this.container) {
		  this.bridge.playing.asObservable().subscribe(value => {
		    if(value){
		      if (this.bridge.index.getValue() === this.index){
            const icon = this.container.nativeElement.querySelector(
              'mat-icon'
            );
            icon.textContent = 'pause_circle_outline';
          }
        } else {
          const icon = this.container.nativeElement.querySelector(
            'mat-icon'
          );
          icon.textContent = 'play_circle_outline';
        }
      })
		}
	}
}
