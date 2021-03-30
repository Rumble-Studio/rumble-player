import { RumblePlayerService } from './playerService';
import { GenericVisual } from './GenericVisual';

export class HTMLRumblePlayer extends HTMLElement {
	// playButton: HTMLButtonElement;
	// pauseButton: HTMLButtonElement;
	// stopButton: HTMLButtonElement;
	// nextButton: HTMLButtonElement;
	// prevButton: HTMLButtonElement;
	// seekBar: GenericSeekbar;

	private visualChildren: GenericVisual[] = [];

	playerService: RumblePlayerService | null;

	constructor(playerService?: RumblePlayerService) {
		super();
		if (playerService) {
			this.playerService = playerService;
		} else {
			this.playerService = null;
		}
	}

	public setPlayer(playerService: RumblePlayerService) {
		this.playerService = playerService;
		this.playerService.percentageUpdateCallbacks.push(
			(newPercentage: number) => this.updatePerPercentage(newPercentage)
		);

		this.playerService.positionUpdateCallbacks.push((newPercentage: number) =>
			this.updatePerPosition(newPercentage)
		);

		// this.playerService.newPercentageCallback = (newPercentage: number) =>
		// 	this.updatePerPercentage(newPercentage);
		// this.playerService.newPositionCallback = (newPosition: number) =>
		// 	this.updatePerPosition(newPosition);
		// this.logKinds();
	}

	setVisualChildren(newVisualChildren: GenericVisual[]) {
		this.stopListeningToVisualChildren();
		this.removeChildren();
		this.visualChildren = newVisualChildren;
		this.addChildren();
		this.startListeningToVisualChildren();
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

	public processEventSeekPerPercentage(event: CustomEvent) {
		this.seekPerPercentage(event.detail.percentage);
	}

	public seekPerPercentage(percentage: number) {
		if (!this.playerService) return;
		this.playerService.seekPerPercentage(percentage);
	}

	public processEventSeekPerPosition(event: CustomEvent) {
		this.seekPerPosition(event.detail.percentage);
	}

	public seekPerPosition(position: number) {
		if (!this.playerService) return;
		this.playerService.seekPerPosition(position);
	}

	public updatePerPercentage(newPercentage: number) {
		this.visualChildren.forEach((vc) =>
			vc.updatePerPercentage(newPercentage)
		);
		// this.seekBar.updatePerPercentage(newPercentage);
	}

	public updatePerPosition(newPosition: number) {
		this.visualChildren.forEach((vc) => vc.updatePerPosition(newPosition));
		// this.seekBar.updatePerPosition(newPosition);
	}

	connectedCallback() {
		this.addChildren();
	}

	removeChildren() {
		this.visualChildren.forEach((vc) => {
			this.removeChild(vc);
		});
	}
	addChildren() {
		this.visualChildren.forEach((vc) => this.appendChild(vc));
	}

	startListeningToVisualChildren() {
		this.visualChildren.forEach((vc) => {
			vc.addEventListener('pause', this.pause);
			vc.addEventListener('play', this.play);
			vc.addEventListener('stop', this.stop);
			vc.addEventListener('next', this.next);
			vc.addEventListener('prev', this.prev);
			vc.addEventListener(
				'seekPerPercentage',
				this.processEventSeekPerPercentage
			);
			vc.addEventListener(
				'seekPerPosition',
				this.processEventSeekPerPosition
			);
		});
	}
	stopListeningToVisualChildren() {
		this.visualChildren.forEach((vc) => {
			vc.removeEventListener('pause', this.pause);
			vc.removeEventListener('play', this.play);
			vc.removeEventListener('stop', this.stop);
			vc.removeEventListener('next', this.next);
			vc.removeEventListener('prev', this.prev);
			vc.removeEventListener(
				'seekPerPercentage',
				this.processEventSeekPerPercentage
			);
			vc.removeEventListener(
				'seekPerPosition',
				this.processEventSeekPerPosition
			);
		});
	}
	// private updateSeekBarListener() {
	// 	this.seekBar.addEventListener(
	// 		'seekPerPercentage',
	// 		(event: CustomEvent) => {
	// 			console.log('seeked per percentage', event.detail.percentage);
	// 			this.seekPerPercentage(event.detail.percentage);
	// 		}
	// 	);
	// }
}

customElements.define('rumble-player', HTMLRumblePlayer);
