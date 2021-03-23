import { RumblePlayer } from './player';

export class HTMLRumblePlayer extends HTMLElement {
	playButton: HTMLButtonElement;
	pauseButton: HTMLButtonElement;
	stopButton: HTMLButtonElement;
	nextButton: HTMLButtonElement;
	prevButton: HTMLButtonElement;

	player: RumblePlayer | null;

	constructor() {
		super();
		this.player = null;
		this.createHTMLChildren();
		this.bindHTMLElements();
	}

	public setPlayer(player: RumblePlayer) {
		this.player = player;
		this.player.newPositionCallback = this.updateVisualPosition
	}

	updateVisualPosition(position:number){
		console.log('LOG BY THE HTML ELEMENT',position)
		// if (this.seekbar){
		// 	this.seekbar.updatePosition(position)
		// }
	}

	// should return as a promise the current index asked to be played
	public play() {
		console.log('PLAY',this.player)
		if (!this.player) return;
		this.player.play();
	}

	public pause() {
		if (!this.player) return;
		this.player.pause();
	}

	public stop() {
		if (!this.player) return;
		this.player.stop();
	}

	public next() {
		if (!this.player) return;
		this.player.next();
	}

	public prev() {
		if (!this.player) return;
		this.player.prev();
	}

	public seek(percentage: number) {
		if (!this.player) return;
		this.player.seekPerPercentage(percentage);
	}

	connectedCallback() {
		this.addChildren();
	}

	createHTMLChildren() {
		this.playButton = document.createElement('button');
		this.playButton.innerText = 'play';
		this.pauseButton = document.createElement('button');
		this.pauseButton.innerText = 'pause';
		this.stopButton = document.createElement('button');
		this.stopButton.innerText = 'stop';
		this.nextButton = document.createElement('button');
		this.nextButton.innerText = 'next';
		this.prevButton = document.createElement('button');
		this.prevButton.innerText = 'prev';
	}

	addChildren() {
		this.appendChild(this.playButton);
		this.appendChild(this.pauseButton);
		this.appendChild(this.stopButton);
		this.appendChild(this.nextButton);
		this.appendChild(this.prevButton);
	}

	bindHTMLElements() {
		this.playButton.addEventListener('click', () => {
			return this.play();
		});
		this.pauseButton.addEventListener('click', () => {
			return this.pause();
		});
		this.stopButton.addEventListener('click', () => {
			return this.stop();
		});
		this.nextButton.addEventListener('click', () => {
			this.next();
		});
		this.prevButton.addEventListener('click', () => {
			this.prev();
		});
	}
}

customElements.define('rumble-player', HTMLRumblePlayer);
