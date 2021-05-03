import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimplePrevButton extends GenericVisual {
	protected _kind = 'SimplePrevButton';
	button: HTMLInputElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'prev');
		this.button.disabled = true;

		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			this.playerService.prev();
		});
	}

	protected setListeners() {
		this.playerService.onEvent('newPlaylist', this.onPlaylist);
	}
	onPlaylist = (event) => {
		this.button = this.shadowRoot.querySelector('input');
		this.button.disabled = !(this.playerService.playlist.length > 0);
	};
}

customElements.define('rs-simple-prev-button', SimplePrevButton);
