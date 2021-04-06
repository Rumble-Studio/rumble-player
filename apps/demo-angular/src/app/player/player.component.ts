import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GenericVisual, HTMLRumblePlayer, LinearBar, RumblePlayerService, SimplePlayButton } from '@rumble-player/rp';

import { fakePlaylist } from '../../config/dummyAudioData.config';
import { ControlButton, Tasks } from './buttons/controls-button';

import * as layout from'./buttons/layout.json'
import { doc } from 'prettier';

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

		if (this.playerHTMLLinear) {
			this.playerHTMLLinear.nativeElement.setPlayer(this.player);
			const linearBar: LinearBar = new LinearBar();
			const simplePlayButton: SimplePlayButton = new SimplePlayButton();
			const myDemoButton: MyDemoButton = new MyDemoButton();
			const BUTTONS = [] as GenericVisual[]
      ['play','pause','stop','next','prev'].forEach(value => {
        BUTTONS.push(new ControlButton(value,Tasks[value]))
      })
      //const myPlayButton: ControlButton = new ControlButton('play',Tasks['play']);
      const children = this.layoutGenerator()
      const visualChildren: GenericVisual[] = [...children,
				linearBar
			];

			this.playerHTMLLinear.nativeElement.setVisualChildren(visualChildren);
      this.playerHTMLLinear.nativeElement.setHeight('250px')
		} else {
			console.warn('PlayerHTML Linear is not available');
		}

	}

	layoutGenerator() {
	  const data = (layout as any).default
    const visualChildren = [] as GenericVisual []
    for (const layoutKey in data) {
      console.log(layoutKey)
      const button = new ControlButton(data[layoutKey].title,data[layoutKey].action)
      for (const key in data[layoutKey].style){
        button.style[key] = data[layoutKey].style[key]
      }
      visualChildren.push(button)
    }
    return visualChildren
  }
}
