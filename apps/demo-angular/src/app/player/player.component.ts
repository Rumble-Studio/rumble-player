import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
	GenericVisual,
	HTMLRumblePlayer,
	RumblePlayerService,
} from '@rumble-player/player';

import {
	fakePlaylist,
	fakePlaylistWithImage,
} from '../../config/dummyAudioData.config';

class MyDemoButton extends GenericVisual {
	protected _kind = 'SimplePlayButton';
	button: HTMLInputElement | undefined;
	state = false;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'toggle');
		this.button.style.backgroundColor = 'red';
		this.list_of_children = [this.button];
	}

	bindHTMLElements() {
		this.addEventListener('click', () => {
			this.state = !this.state;
			if (this.state) {
				const e = new Event('play');
				this.dispatchEvent(e);
			} else {
				const e = new Event('pause');
				this.dispatchEvent(e);
			}
		});
	}
}
customElements.define('rs-demo-play-button', MyDemoButton);

@Component({
	selector: 'rumble-player-player',
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements AfterViewInit {
	public player: RumblePlayerService;

	@ViewChild('playerHTML')
	playerHTML: ElementRef<HTMLRumblePlayer> | undefined;

	public eventsHistory: string[];
	rate = 1;
	volume = 1;
	public RSSLink: string;

	constructor() {
		this.eventsHistory = [];
		this.player = new RumblePlayerService();
		this.RSSLink =
			'https://feed.rumblestudio.app/collection/xjIPbCryeIQpV3ut5dXb';
		//this.player.setPlaylistFromObject(fakePlaylistWithImage);
	}

	togglePlayer() {
		if (this.player.isPlaying) {
			this.player.pause();
		} else {
			this.player.play();
		}
	}

	ngAfterViewInit() {
		if (this.playerHTML) {
			this.playerHTML.nativeElement.setPlayer(this.player);
			this.playerHTML.nativeElement.loadConfig('config6');
			// this.player.setPLaylistFromRSSFeedURL('https://feeds.buzzsprout.com/159584.rss').then(r => {
			//   console.log(r)
			// })
		} else {
			console.warn('PlayerHTML Linear is not available');
		}
	}

	// layoutGenerator() {
	// 	const data = (layout as any).default;
	// 	const visualChildren = [] as GenericVisual[];
	// 	for (const layoutKey in data) {
	// 		console.log(layoutKey);
	// 		const button = new ControlButton(
	// 			data[layoutKey].title,
	// 			data[layoutKey].action
	// 		);
	// 		for (const key in data[layoutKey].style) {
	// 			button.style[key] = data[layoutKey].style[key];
	// 		}
	// 		visualChildren.push(button);
	// 	}
	// 	return visualChildren;
	// }

	addSong() {
		if (this.playerHTML?.nativeElement.playerService)
			this.playerHTML.nativeElement.playerService.addSong(fakePlaylist[0]);
	}

	changeRSS(event: any) {
		this.RSSLink = event.target.value;
	}
	setRSS() {
		this.player.setPLaylistFromRSSFeedURL(
			'https://feeds.buzzsprout.com/159584.rss'
		);
	}

	shuffle() {
		this.player.shuffle = true;
	}

	setRate($event: any) {
		this.rate = $event.target.value;
	}
	setVolume($event: any) {
		this.volume = $event.target.value;
	}
}
