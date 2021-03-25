import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from '@angular/core';
import {
	HTMLRumblePlayer,
	PercentageSeekBar,
	RumblePlayerService,
} from '@rumble-player/rp';

import { fakePlaylist } from '../../config/dummyAudioData.config';

@Component({
	selector: 'rumble-player-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit {
	public player: RumblePlayerService;
	@ViewChild('playerHTML')
	playerHTML: ElementRef<HTMLRumblePlayer> | undefined;
	public eventsHistory: string[];

	constructor() {
		this.eventsHistory = [];
		this.player = new RumblePlayerService();
		this.player.setPlaylistFromUrls(fakePlaylist);
	}

	ngOnInit(): void {}

	togglePlayer() {
		if (this.player.isPlaying) {
			this.player.pause();
		} else {
			this.player.play();
		}
	}

	ngAfterViewInit() {
		if (this.playerHTML) {
			const percentageSeekBar: PercentageSeekBar = new PercentageSeekBar();
			// this.playerHTML.nativeElement.setSeekbar(percentageSeekBar);
			this.playerHTML.nativeElement.setPlayer(this.player);
			this.playerHTML.nativeElement.appendChild(percentageSeekBar);
		}
	}
}
