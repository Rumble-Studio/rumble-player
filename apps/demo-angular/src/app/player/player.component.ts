import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
	HTMLRumblePlayer,
	RumblePlayerService,
	SimplePlayButton,
	GenericVisual,
	LinearBar,
} from '@rumble-player/rp';

import { fakePlaylist } from '../../config/dummyAudioData.config';

class MyDemoButton extends GenericVisual {
	protected _kind = 'SimplePlayButton';

	state = false;

	constructor() {
		super();
	}
	/** custom HTML elements  */
	button: HTMLInputElement | undefined;
	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'toggle');
		this.button.style.backgroundColor = 'red';
	}
	protected setInnerHTML() {
		// custom creation of HTML children
		if (this.button) {
			this.appendChild(this.button);
		}
	}
	bindHTMLElements() {
		// custom bindings of events
		// in particular, play button can emit "play" on click
		this.addEventListener('click', () => {
			console.log('CLICKED')
	
			this.state = !this.state;

			if (this.state) {
				console.log('should play')
				const e = new Event('play');
				this.dispatchEvent(e);
			} else {
				console.log('should pause')

				const e = new Event('pause');
				this.dispatchEvent(e);
			}
		});
	}
	updateVisual() {
		//
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

	@ViewChild('playerHTMLGeneric')
	playerHTMLGeneric: ElementRef<HTMLRumblePlayer> | undefined;

	@ViewChild('playerHTMLPercentage')
	playerHTMLPercentage: ElementRef<HTMLRumblePlayer> | undefined;

	@ViewChild('playerHTMLLinear')
	playerHTMLLinear: ElementRef<HTMLRumblePlayer> | undefined;

	@ViewChild('playerHTMLGiraffe')
	playerHTMLGiraffe: ElementRef<HTMLRumblePlayer> | undefined;

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
		// if (this.playerHTMLGeneric) {
		// 	const genericSeekbar: GenericSeekbar = new GenericSeekbar();
		// 	this.playerHTMLGeneric.nativeElement.setSeekbar(genericSeekbar);
		// 	this.playerHTMLGeneric.nativeElement.setPlayer(this.player);
		// } else {
		// 	console.warn('PlayerHTML Generic is not available');
		// }

		if (this.playerHTMLLinear) {
			this.playerHTMLLinear.nativeElement.setPlayer(this.player);
			const linearBar: LinearBar = new LinearBar();
			const simplePlayButton: SimplePlayButton = new SimplePlayButton();
			const myDemoButton: MyDemoButton = new MyDemoButton();
			const visualChildren: GenericVisual[] = [
				simplePlayButton,
				linearBar,
				myDemoButton,
			];
			this.playerHTMLLinear.nativeElement.setVisualChildren(visualChildren);
		} else {
			console.warn('PlayerHTML Linear is not available');
		}

		// if (this.playerHTMLPercentage) {
		// 	const percentageSeekBar: PercentageSeekBar = new PercentageSeekBar();
		// 	this.playerHTMLPercentage.nativeElement.setSeekbar(percentageSeekBar);
		// 	this.playerHTMLPercentage.nativeElement.setPlayer(this.player);
		// } else {
		// 	console.warn('PlayerHTML Percentage is not available');
		// }

		// if (this.playerHTMLGiraffe) {
		// 	const giraffeSeekBar: GiraffeSeekBar = new GiraffeSeekBar();
		// 	this.playerHTMLGiraffe.nativeElement.setSeekbar(giraffeSeekBar);
		// 	this.playerHTMLGiraffe.nativeElement.setPlayer(this.player);
		// } else {
		// 	console.warn('PlayerHTML Giraffe is not available');
		// }
	}
}
