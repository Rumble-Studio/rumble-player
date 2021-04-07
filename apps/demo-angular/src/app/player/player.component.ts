import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  GenericVisual,
  HTMLRumblePlayer,
  LinearBar,
  RumblePlayerService,
  SimpleConfigurableButton,
  SimplePauseButton,
  SimplePlayButton,
  SimpleNextButton,
  SimplePrevButton,
  SimpleForwardButton,
  SimpleBackwardButton,
  SimpleStopButton
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
		// Toggle button won't work unless we implement toggle feature at playerService level
		// if initial state is true and clicked while playing, nothing will happen

		this.addEventListener('click', () => {
			console.log('CLICKED');

			this.state = !this.state;

			if (this.state) {
				console.log('should play');
				const e = new Event('play');
				this.dispatchEvent(e);
			} else {
				console.log('should pause');

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

	@ViewChild('playerHTML')
	playerHTML: ElementRef<HTMLRumblePlayer> | undefined;

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
		if (this.playerHTML) {
			this.playerHTML.nativeElement.setPlayer(this.player);

			const linearBar: LinearBar = new LinearBar();
			const simplePlayButton: SimplePlayButton = new SimplePlayButton();
			const simplePauseButton: SimplePauseButton = new SimplePauseButton();
			const nextBtn: SimpleNextButton = new SimpleNextButton()
			const prevBtn: SimplePrevButton = new SimplePrevButton()
			const stopBtn: SimpleStopButton = new SimpleStopButton()
			const forwardBtn: SimpleForwardButton = new SimpleForwardButton(10)
			const backwardBtn: SimpleBackwardButton = new SimpleBackwardButton(5)
			const myDemoButton: MyDemoButton = new MyDemoButton();
			const visualChildren: GenericVisual[] = [
				linearBar,
				simplePlayButton,
				simplePauseButton,
        stopBtn,
				nextBtn,
				prevBtn,
        forwardBtn,
        backwardBtn,
				myDemoButton,
			];

			this.playerHTML.nativeElement.setVisualChildren(visualChildren);


			// TODO: this.playerHTML.nativeElement.setFromConfig('default1');

			// this.playerHTML.nativeElement.setHeight('250px');
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
}
