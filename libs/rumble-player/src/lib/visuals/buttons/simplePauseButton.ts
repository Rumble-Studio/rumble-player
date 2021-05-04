import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimplePauseButton extends GenericVisual {
	protected _kind = 'SimplePauseButton';
	button: HTMLInputElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'pause');
		this.button.disabled = true;
		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			this.dispatchEvent(new CustomEvent('pause'));
		});
	}

	protected setListeners() {
		this.playerHTML.onEvent('play', this.disable);
		this.playerHTML.onEvent('pause', this.enable);
		this.playerHTML.onEvent('stop', this.enable);
	}
	disable = (event) => {
		this.button = this.shadowRoot.querySelector('input');
		this.button.disabled = false;
	};
	enable = (event) => {
		this.button = this.shadowRoot.querySelector('input');
		this.button.disabled = true;
	};
}

customElements.define('rs-simple-pause-button', SimplePauseButton);
