import { GenericVisual } from '../../GenericVisual';

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
		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			this.playerService.next();
		});
	}
}

customElements.define('rs-simple-next-button', SimpleNextButton);
