import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimpleForwardButton extends GenericVisual {
	protected _kind = 'SimpleForwardButton';
	button: HTMLInputElement;
	private jump: number;

	protected dontBuildHTMLElements = true;

	constructor(jump = 15) {
		super(true); // true to delay HTML logic and let jump be set
		this.jump = jump;
		this.createHTMLElements();
		this.setInnerHTML();
		this.bindHTMLElements();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'forward(' + this.jump + 's)');
		this.button.disabled = true;

		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			const e = new CustomEvent('seekPerPosition', {
				detail: { jump: this.jump },
			});
			this.dispatchEvent(e);
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

customElements.define('rs-simple-forward-button', SimpleForwardButton);
