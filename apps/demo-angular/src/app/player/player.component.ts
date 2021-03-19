import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EVENTLIST, RumblePlayer, GenericSeekbar } from '@rumble-player/rp';
import { fakePlaylist } from '../../config/dummyAudioData.config';

@Component({
	selector: 'rumble-player-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
	public player: RumblePlayer;
	public seekbar: GenericSeekbar;
	public eventsHistory: string[];

	constructor(private ref: ElementRef) {
		this.eventsHistory = [];
		this.player = new RumblePlayer();
		this.seekbar = new GenericSeekbar();
		this.ref.nativeElement.appendChild(this.player);
		this.ref.nativeElement.appendChild(this.seekbar);

		EVENTLIST.forEach((value) => {
			this.player.addEventListener(value, (event: Event) => {
				this.eventsHistory.push(
					'Event type: ' + value + ', data : ' + JSON.stringify(event)
				);
			});
		});
	}

	ngOnInit(): void {
		this.player.setPlaylistFromUrls(fakePlaylist);
	}

	togglePlayer() {
		if (this.player.isPlaying) {
			this.player.pause();
		} else {
			this.player.play();
		}
	}
}
