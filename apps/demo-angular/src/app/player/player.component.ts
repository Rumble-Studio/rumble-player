import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RumblePlayerHTML, RumblePlayerService } from '@rumble-player/rp';

import { fakePlaylist } from '../../config/dummyAudioData.config';
import { BUTTONS } from '../../config/layoutParser';

@Component({
	selector: 'rumble-player-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
	public player: RumblePlayerService;

	// @ViewChild('myname') input:ElementRef = new ElementRef(''); 

	playerHTML: RumblePlayerHTML = new RumblePlayerHTML();

	public eventsHistory: string[];

	constructor(private ref: ElementRef) {
		console.log('%cButtons are : ', 'color:red', BUTTONS);
		this.eventsHistory = [];
		this.player = new RumblePlayerService();
		this.ref.nativeElement.appendChild(this.playerHTML);
	}

	ngOnInit(): void {
		this.player.setPlaylistFromUrls(fakePlaylist);
		this.playerHTML.setPlayer(this.player);
	}

	togglePlayer() {
		if (this.player.isPlaying) {
			this.player.pause();
		} else {
			this.player.play();
		}
	}
}
