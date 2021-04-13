import { GenericVisual } from '../../GenericVisual';

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
}

customElements.define('rs-simple-forward-button', SimpleForwardButton);
