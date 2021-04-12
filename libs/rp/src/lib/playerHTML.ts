import { RumblePlayerService } from './playerService';
import { GenericVisual } from './GenericVisual';
import {
	LinearBar,
	SimpleBackwardButton,
	SimpleForwardButton,
	SimpleNextButton,
	SimplePauseButton,
	SimplePlayButton,
	SimplePrevButton,
	SimpleStopButton,
} from '../index';
import { config1, config2, config3, config4, configPlayPause } from '../config/configs';
import { SimplePlaylist } from './visuals/playlist/SimplePlaylist';

export interface playerConfig {
	[key: string]: string | string[];
	visualChildren: string[];
}

export class HTMLRumblePlayer extends HTMLElement {
	private visualChildren: GenericVisual[] = [];
	private _shadow: ShadowRoot;
	// private layoutContainer = document.createElement('div')

	playerService: RumblePlayerService | null;

	playRef: () => void;
	pauseRef: () => void;
	stopRef: () => void;
	nextRef: () => void;
	prevRef: () => void;
	processEventSeekPerPercentageRef: (event: CustomEvent) => void;
	processEventSeekPerPositionRef: (event: CustomEvent) => void;

	constructor(playerService?: RumblePlayerService) {
		super();
		this._shadow = this.attachShadow({ mode: 'open' });
		if (playerService) {
			this.playerService = playerService;
		} else {
			this.playerService = null;
		}

		this.playRef = () => this.play();
		this.pauseRef = () => this.pause();
		this.stopRef = () => this.stop();
		this.nextRef = () => this.next();
		this.prevRef = () => this.prev();
		this.processEventSeekPerPercentageRef = (event: CustomEvent) =>
			this.processEventSeekPerPercentage(event);
		this.processEventSeekPerPositionRef = (event: CustomEvent) =>
			this.processEventSeekPerPosition(event);
	}

	loadConfig(config: playerConfig | string) {
		if (typeof config == 'string') {
			switch (config) {
				case 'config1':
					this.setFromConfig(config1);
					break;
				case 'config2':
					this.setFromConfig(config2);
					break;
				case 'config3':
					this.setFromConfig(config3);
					break;
        case 'configPlayPause':
          this.setFromConfig(configPlayPause);
          break;
        case 'config4':
          this.setFromConfig(config4);
          break;
				default:
					break;
			}
		} else {
			this.setFromConfig(config);
		}
	}

	setFromConfig(config: playerConfig) {
		const visualChildren: GenericVisual[] = [];
		const layout = config.visualChildren;
		layout.forEach((value) => {
			switch (value) {
				case 'LinearBar':
					visualChildren.push(new LinearBar());
					break;
				case 'SimplePlayButton':
					visualChildren.push(new SimplePlayButton());
					break;
				case 'SimplePauseButton':
					visualChildren.push(new SimplePauseButton());
					break;
				case 'SimpleStopButton':
					visualChildren.push(new SimpleStopButton());
					break;
				case 'SimpleNextButton':
					visualChildren.push(new SimpleNextButton());
					break;
				case 'SimplePrevButton':
					visualChildren.push(new SimplePrevButton());
					break;
				case 'SimpleForwardButton':
					visualChildren.push(new SimpleForwardButton());
					break;
				case 'SimpleBackwardButton':
					visualChildren.push(new SimpleBackwardButton());
					break;
        case 'SimplePlaylist':
          const playlist = new SimplePlaylist()
          playlist.playlist = this.playerService.playlist
          visualChildren.push(playlist);
          break;
				default:
					break;
			}
		});
		this.setVisualChildren(visualChildren);
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
		const { jump } = event.detail;
		const position = this.playerService.position;
		const newPosition = jump + position;
		this.seekPerPosition(newPosition);
	}

	public seekPerPosition(position: number) {
		if (!this.playerService) return;
		this.playerService.seekPerPosition(position);
	}

	public updatePerPercentage(newPercentage: number) {
		this.visualChildren.forEach((vc) =>
			vc.updatePerPercentage(newPercentage)
		);
	}

	public updatePerPosition(newPosition: number) {
		this.visualChildren.forEach((vc) => vc.updatePerPosition(newPosition));
	}

	connectedCallback() {
		this.addChildren();
	}

	removeChildren() {
		this.visualChildren.forEach((vc) => {
			this._shadow.removeChild(vc);
		});
	}

	// setHeight(height: string) {
	// 	this.layoutContainer.style.height = height;
	// }

	addChildren() {
		// this.layoutContainer.style.position = 'relative';
		// this.appendChild(this.layoutContainer);
		// this.visualChildren.forEach((vc) => this.layoutContainer.appendChild(vc));
		this.visualChildren.forEach((vc) => {
		  vc.playerService = this.playerService
		  this._shadow.appendChild(vc)
		});
	}

	startListeningToVisualChildren() {
		this.visualChildren.forEach((vc) => {
			vc.addEventListener('pause', this.pauseRef);
			vc.addEventListener('play', this.playRef);
			vc.addEventListener('stop', this.stopRef);
			vc.addEventListener('next', this.nextRef);
			vc.addEventListener('prev', this.prevRef);
			vc.addEventListener(
				'seekPerPercentage',
				this.processEventSeekPerPercentageRef
			);
			vc.addEventListener(
				'seekPerPosition',
				this.processEventSeekPerPositionRef
			);
		});
	}

	stopListeningToVisualChildren() {
		this.visualChildren.forEach((vc) => {
			vc.removeEventListener('pause', this.pauseRef);
			vc.removeEventListener('play', this.playRef);
			vc.removeEventListener('stop', this.stopRef);
			vc.removeEventListener('next', this.nextRef);
			vc.removeEventListener('prev', this.prevRef);
			vc.removeEventListener(
				'seekPerPercentage',
				this.processEventSeekPerPercentageRef
			);
			vc.removeEventListener(
				'seekPerPosition',
				this.processEventSeekPerPositionRef
			);
		});
	}
}

customElements.define('rumble-player', HTMLRumblePlayer);
