import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  PlayerHTML
} from '@rumble-player/player';
import {RumbleConfig} from '@rumble-player/configs'
import { fakePlaylist } from '../../config/dummyAudioData.config';
import { PlayerService } from '@rumble-player/service';

@Component({
	selector: 'rumble-player-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements AfterViewInit {
	public playerService: PlayerService;

	@ViewChild('playerHTML')
	playerHTML: ElementRef<PlayerHTML> | undefined;

	@ViewChild('myCustomContainerDefault')
	myCustomContainerDefault: ElementRef<HTMLElement> | undefined;

	@ViewChild('myCustomContainerCustom')
	myCustomContainerCustom: ElementRef<HTMLElement> | undefined;

	public eventsHistory: string[];
	rate = 1;
	volume = 1;
	public RSSLink: string;

	constructor() {
		this.eventsHistory = [];
		this.playerService = new PlayerService();
		this.RSSLink =
			'https://feed.rumblestudio.app/collection/xjIPbCryeIQpV3ut5dXb';
		//this.playerService.setPlaylistFromObject(fakePlaylistWithImage);
	}

	togglePlayer() {
		if (this.playerService.isPlaying) {
			this.playerService.pause();
		} else {
			this.playerService.play();
		}
	}

	ngAfterViewInit() {
		if (this.playerHTML) {
			console.log('PLAYERHTML:', { playerHTML: this.playerHTML });
			this.playerHTML.nativeElement.setPlayerService(this.playerService);

			const myButton = document.createElement('input');

			myButton.setAttribute('type', 'button');
			myButton.setAttribute('value', '(angular added) submit');
			myButton.classList.add('myClassOfButton');
			this.playerHTML.nativeElement.addEventListener('play', () => {
				myButton.setAttribute('disabled', 'true');
			});
			this.playerHTML.nativeElement.addEventListener('pause', () => {
				myButton.removeAttribute('disabled');
			});
			myButton.addEventListener('click', () => {
				if (this.playerHTML) this.playerHTML.nativeElement.play({});
			});

			this.playerHTML.nativeElement.appendChild(myButton);

			// this.playerHTML.nativeElement.loadConfig('config6');
			// this.playerService.setPLaylistFromRSSFeedURL('https://feeds.buzzsprout.com/159584.rss').then(r => {
			//   console.log(r)
			// })
		} else {
			console.warn('PlayerHTML Linear is not available');
		}

		if (this.myCustomContainerDefault) {
			RumbleConfig.defaultConfig(
				this.playerService,
				this.myCustomContainerDefault.nativeElement
			);
		}
		if (this.myCustomContainerCustom) {
			RumbleConfig.customConfig(
				this.playerService,
				this.myCustomContainerCustom.nativeElement
			);
		}
	}

	addSong() {
		if (this.playerHTML?.nativeElement.playerService)
			this.playerHTML.nativeElement.playerService.addSong(fakePlaylist[0]);
	}

	changeRSS(event: any) {
		this.RSSLink = event.target.value;
	}

	setRSS($event) {
	  this.RSSLink = $event.target.value
		this.playerService.setPLaylistFromRSSFeedURL(
			this.RSSLink
		);
	}

	shuffle() {
		this.playerService.shuffle = true;
	}

	setRate($event: any) {
		this.rate = $event.target.value;
	}
	setVolume($event: any) {
		this.volume = $event.target.value;
	}
}
