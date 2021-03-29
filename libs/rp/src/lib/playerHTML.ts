import { GenericSeekbar } from './seekbar/generic/GenericSeekBar';
import { RumblePlayerService } from './playerService';

export class HTMLRumblePlayer extends HTMLElement {
	playButton: HTMLButtonElement;
	pauseButton: HTMLButtonElement;
	stopButton: HTMLButtonElement;
	nextButton: HTMLButtonElement;
	prevButton: HTMLButtonElement;
	seekBar: GenericSeekbar;

	playerService: RumblePlayerService | null;

	constructor(playerService?: RumblePlayerService) {
		super();
		if (playerService) {
			this.playerService = playerService;
		} else {
			this.playerService = null;
		}
		this.createHTMLChildren(); // instanciate also seekBar
		this.bindHTMLElements();
	}

	public setPlayer(playerService: RumblePlayerService) {
		this.playerService = playerService;
		this.playerService.percentageUpdateCallbacks.push((newPercentage: number) =>
		this.updatePerPercentage(newPercentage))

		this.playerService.positionUpdateCallbacks.push((newPercentage: number) =>
		this.updatePerPosition(newPercentage))
		
		// this.playerService.newPercentageCallback = (newPercentage: number) =>
		// 	this.updatePerPercentage(newPercentage);
		// this.playerService.newPositionCallback = (newPosition: number) =>
		// 	this.updatePerPosition(newPosition);
		this.logKinds();
	}

	setSeekbar(seekbar: GenericSeekbar) {
		// remove old seekbar from the DOM
		this.removeChild(this.seekBar);
		// update seekbar
		this.seekBar = seekbar;
		// add new seekbar to dom
		this.appendChild(this.seekBar);
		// this.connectedCallback();

		this.updateSeekBarListener();
		this.logKinds();
	}

	// should return as a promise the current index asked to be played
	public play() {
		console.log('PLAY', this.playerService);
		if (!this.playerService) return;
		this.playerService.play();
	}

	public pause() {
		if (!this.playerService) return;
		this.playerService.pause();
	}

	public stop() {
		if (!this.playerService) return;
		this.playerService.stop();
	}

	public next() {
		if (!this.playerService) return;
		this.playerService.next();
	}

	public prev() {
		if (!this.playerService) return;
		this.playerService.prev();
	}

	public seekPerPercentage(percentage: number) {
		if (!this.playerService) return;
		this.playerService.seekPerPercentage(percentage);
	}

	public updatePerPercentage(newPercentage: number) {
		this.seekBar.updatePerPercentage(newPercentage);
	}

	public updatePerPosition(newPosition: number) {
		this.seekBar.updatePerPosition(newPosition);
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
		this.seekBar = new GenericSeekbar();
		this.logKinds();
	}

	addChildren() {
		this.appendChild(this.playButton);
		this.appendChild(this.pauseButton);
		this.appendChild(this.stopButton);
		this.appendChild(this.nextButton);
		this.appendChild(this.prevButton);
		this.appendChild(this.seekBar);
		this.logKinds();
	}

	bindHTMLElements() {
		this.playButton.addEventListener('click', () => {
			console.log('clicked on play in playerHTML')
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
		this.updateSeekBarListener();

		this.logKinds();
	}
	private updateSeekBarListener() {
		this.seekBar.addEventListener(
			'seekPerPercentage',
			(event: CustomEvent) => {
				console.log('seeked per percentage', event.detail.percentage);
				this.seekPerPercentage(event.detail.percentage);
			}
		);
	}

	logKinds() {
		// to log the kind of each sub element
		if (this.seekBar) {
			console.log('seekbar:', this.seekBar.kind);
			this.seekBar.visuals.forEach((v) => {
				console.log('visual:', v.kind);
			});
		} else {
			console.log('No seekbar yet');
		}
	}
}

customElements.define('rumble-player', HTMLRumblePlayer);
