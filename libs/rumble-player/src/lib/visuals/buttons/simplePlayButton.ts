import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimplePlayButton extends GenericVisual {
	protected _kind = 'SimplePlayButton';
	button: HTMLInputElement;
	index: number;

	constructor(index = -2) {
		super();
		this.index = index;
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'play');
		this.button.disabled = true;

		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			this.playerService.play(this.index);
		});
	}
	protected updateState(state: playerServiceEvent) {
		this.button = this.shadowRoot.querySelector('input');
		if (state.type === 'newPlaylist') {
			if (this.playerService.playlist.length > 0) {
				this.button.disabled = false;
			}
		}
		if (state.type === 'play') {
			this.button.disabled = true;
		} else if (state.type === 'pause' || state.type === 'stop') {
			this.button.disabled = !(this.playerService.playlist.length > 0);
		}
	}

	protected setListeners() {
		this.playerService.onEvent('play', this.disable);
		this.playerService.onEvent('pause', this.enable);
		this.playerService.onEvent('stop', this.enable);
		this.playerService.onEvent('newPlaylist', this.enable);
	}
	disable = (event) => {
		this.button = this.shadowRoot.querySelector('input');
		this.button.disabled = true;
	};
	enable = (event) => {
		console.log('NEW PLAYLIST FROM BUTTON');
		this.button = this.shadowRoot.querySelector('input');
		this.button.disabled = !(this.playerService.playlist.length > 0);
	};
}

customElements.define('rs-simple-play-button', SimplePlayButton);
