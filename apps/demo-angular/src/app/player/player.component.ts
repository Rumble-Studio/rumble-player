import {
	AfterViewInit,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
} from '@angular/core';
import {
	GenericSeekbar,
	HTMLRumblePlayer,
	LinearSeekBar,
	PercentageSeekBar,
	RumblePlayerService,
} from '@rumble-player/rp';

import { fakePlaylist } from '../../config/dummyAudioData.config';

@Component({
	selector: 'rumble-player-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements AfterViewInit {
	public player: RumblePlayerService;
	@ViewChild('playerHTML')
	playerHTMLGeneric: ElementRef<HTMLRumblePlayer> | undefined;
	//playerHTMLLinear: ElementRef<HTMLRumblePlayer> | undefined;
	//playerHTMLPercentage: ElementRef<HTMLRumblePlayer> | undefined;
	public eventsHistory: string[];

	constructor() {
		this.eventsHistory = [];
		this.player = new RumblePlayerService();
		this.player.setPlaylistFromUrls(fakePlaylist);
	}

	togglePlayer() {
		if (this.player.isPlaying) {
			this.player.pause();
		} else {
			this.player.play();
		}
	}

	ngAfterViewInit() {
		// if (this.playerHTMLLinear) {
		// 	const linearSeekbar: LinearSeekBar = new LinearSeekBar()
		// 	this.playerHTMLLinear.nativeElement.setSeekbar(linearSeekbar);
		// 	this.playerHTMLLinear.nativeElement.setPlayer(this.player);
		//
		// }
		if (this.playerHTMLGeneric) {
			const genericSeekbar: GenericSeekbar = new GenericSeekbar();
			this.playerHTMLGeneric.nativeElement.setSeekbar(genericSeekbar);
			this.playerHTMLGeneric.nativeElement.setPlayer(this.player);
		}
		// if (this.playerHTMLPercentage) {
		//   const percentageSeekBar: PercentageSeekBar = new PercentageSeekBar();
		//   this.playerHTMLPercentage.nativeElement.setSeekbar(percentageSeekBar);
		//   this.playerHTMLPercentage.nativeElement.setPlayer(this.player);
		//
		// }
	}
}
