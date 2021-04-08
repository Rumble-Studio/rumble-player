import { GenericVisual } from '../../GenericVisual';

export class SimpleCustomButton extends GenericVisual {
	protected _kind = 'SimpleCustomButton';
	button: HTMLInputElement;
	private eventToEmit: string;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', this.eventToEmit);
		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			const e = new Event(this.eventToEmit);
			this.dispatchEvent(e);
		});
	}
}

customElements.define('rs-simple-custom-button', SimpleCustomButton);


