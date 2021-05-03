import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimpleNextButton extends GenericVisual {
	protected _kind = 'SimpleNextButton';
	button: HTMLInputElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'next');
		this.button.disabled = true;

		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			this.playerService.next();
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

customElements.define('rs-simple-next-button', SimpleNextButton);
