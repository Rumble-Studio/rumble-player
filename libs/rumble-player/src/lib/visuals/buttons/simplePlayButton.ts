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

	protected setEmitters() {
		this.button.addEventListener('click', () => {
			this.playerHTML.processEventPlayRef(new CustomEvent('play'));
		});
	}

	protected setListeners() {
		console.log('setting listener');
		this.playerHTML.addEventListener('newPlaylist', this.enable);
		this.playerHTML.addEventListener('play', this.disable);
		this.playerHTML.addEventListener('pause', this.enable);
		this.playerHTML.addEventListener('stop', this.enable);
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
