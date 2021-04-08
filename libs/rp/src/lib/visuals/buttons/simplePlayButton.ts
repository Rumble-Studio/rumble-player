import { GenericVisual } from '../../GenericVisual';

export class SimplePlayButton extends GenericVisual {
	protected _kind = 'SimplePlayButton';
	button: HTMLInputElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'play');
		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			const e = new Event('play');
			this.dispatchEvent(e);
		});
	}
}

customElements.define('rs-simple-play-button', SimplePlayButton);
