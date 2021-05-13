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
	  console.log('[playerHTML](NEXT)NEXT FROM PLAYER HTML')
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
  public seekForJump(event: CustomEvent) {
    const { jump } = event.detail;
    const position = this.playerService.position;
    const newPosition = jump + position;
    this.seekPerPosition(newPosition);
  }

  seekPerPercentageAndIndex(clickEvent: any) {
    const {
      index,
      percentage,
      stopOthers,
      keepPlaying,
      updateGlobalIndex,
      finishOthers,
    } = clickEvent.detail;

    const wasPlaying = this.playerService.isPlaying;

    if (stopOthers) this.playerService.stop();

    if (finishOthers && index > 0) {
      this.playerService.stop();
      this.playerService.index = 0;
      while (this.playerService.index < index) {
        this.playerService.seekPerPercentage(99);
        this.playerService.play();
        this.playerService.pause();
        this.playerService.next();
      }
    }

    if (index !== this.playerService.index && updateGlobalIndex) {
      this.playerService.index = index;
    }

    this.seekPerPercentage(percentage, index);
    if (keepPlaying && wasPlaying) this.playerService.play(index);
  }
}

customElements.define('rumble-player', PlayerHTML);
