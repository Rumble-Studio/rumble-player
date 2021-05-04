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
			this.dispatchEvent(new CustomEvent('play'));
		});
	}

	protected setListeners() {
		this.playerHTML.onEvent('play', this.disable);
		this.playerHTML.onEvent('pause', this.enable);
		this.playerHTML.onEvent('stop', this.enable);
		this.playerHTML.onEvent('newPlaylist', this.enable);
	}
	disable = (event) => {
		this.button = this.shadowRoot.querySelector('input');
		this.button.disabled = true;
	};
	enable = (event) => {
		this.button = this.shadowRoot.querySelector('input');
		this.button.disabled = !(this.playerHTML.playlist.length > 0);
	};
}

customElements.define('rs-simple-play-button', SimplePlayButton);
