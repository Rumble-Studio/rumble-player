import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EVENTLIST, RumblePlayer } from '@rumble-player/rp';
import { fakePlaylist } from '../../config/dummyAudioData.config';

@Component({
	selector: 'rumble-player-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
	public player: RumblePlayer
	public eventsHistory: string[]

	constructor(private ref: ElementRef) {
		this.eventsHistory = []
		this.player=new RumblePlayer()
		this.ref.nativeElement.appendChild(this.player)

		EVENTLIST.forEach((value) => {
			this.player.addEventListener(value, ($event: CustomEvent) => {
				this.eventsHistory.push(
					'Event type: ' +
						value +
						', data : ' +
						JSON.stringify($event.detail)
				);
			});
		});
	}

	ngOnInit(): void {
		this.player.setPlaylist(fakePlaylist);
	}

	togglePlayer() {
		if (this.player.isPlaying) {
			this.player.pause();
		} else {
			this.player.play();
		}
	}
}
