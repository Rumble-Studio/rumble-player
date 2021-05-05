import {
	playerServiceEvent,
	PlayerService,
} from './PlayerService';

export class PlayerHTML extends HTMLElement {
	playerService: PlayerService | null;
	get playlist() {
		return this.playerService.playlist;
	}
	get index() {
		return this.playerService.index;
	}
	get position() {
		return this.playerService.position;
	}
	get percentage() {
		return this.playerService.percentage;
	}

	getSongTimeLeft(index?: number) {
		return this.playerService.getSongTimeLeft(index);
	}
	getSongTotalTime(index?: number) {
		return this.playerService.getSongTotalTime(index);
	}

	constructor(playerService?: PlayerService) {
		super();
		if (playerService) {
			this.playerService = playerService;
		} else {
			this.playerService = null;
		}
	}

	public setPlayerService(playerService: PlayerService) {
		this.playerService = playerService;
		this.playerService.addNewOnCallback((payload)=>this.eventsDispatcher(payload));
		console.log('PlayerHTML received a playerService!')
	}

	// DISPATCH RECEIVED EVENTS FROM SERVICE
	private eventsDispatcher(payload: playerServiceEvent) {
		const e = new CustomEvent(payload.type, { detail: payload.state });
		this.dispatchEvent(e);
	}

	// SEND REQUESTS TO SERVICE:
	public play(options) {
		if (!this.playerService) return;
		this.playerService.playWithOptions(options);
	}
	public pause(options) {
		if (!this.playerService) return;
		this.playerService.pause(options);
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
	public seekPerPercentage(percentage: number, index?: number) {
		if (!this.playerService) return;
		if (index !== undefined && index !== null) {
			this.playerService.seekPerPercentage(percentage, index);
		} else {
			this.playerService.seekPerPercentage(percentage);
		}
	}
	public seekPerPosition(position: number) {
		if (!this.playerService) return;
		this.playerService.seekPerPosition(position);
	}
}

customElements.define('rumble-player', PlayerHTML);
