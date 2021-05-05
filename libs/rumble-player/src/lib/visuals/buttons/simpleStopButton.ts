import { GenericVisual } from '../../GenericVisual';
import { playerServiceEvent } from '../../playerService';

export class SimpleStopButton extends GenericVisual {
	protected _kind = 'SimpleStopButton';
	button: HTMLInputElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'stop');
		this.button.disabled = true;
		this.list_of_children = [this.button];
	}

	protected setEmitters() {
		this.button.addEventListener('click', () => {
			this.playerHTML.processEventStopRef();
		});
	}
	protected setListeners() {
		this.playerHTML.addEventListener('play', this.disable);
		this.playerHTML.addEventListener('stop', this.enable);
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

customElements.define('rs-simple-stop-button', SimpleStopButton);
