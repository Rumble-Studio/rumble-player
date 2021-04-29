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
	protected updateState(state: playerServiceEvent) {
		this.button = this.shadowRoot.querySelector('input');
		if (state.type === 'newPlaylist') {
			if (this.playerService.playlist.length > 0) {
				this.button.disabled = false;
			}
		}
	}
}

customElements.define('rs-simple-next-button', SimpleNextButton);
