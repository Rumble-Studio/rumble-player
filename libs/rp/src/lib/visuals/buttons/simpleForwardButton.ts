import { GenericVisual } from '../../GenericVisual';

export class SimpleForwardButton extends GenericVisual {
	protected _kind = 'SimpleForwardButton';
	button: HTMLInputElement;
  private jump: number;


	constructor(jump=15) {
		super();
    this.jump = jump;
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'forward('+this.jump+'s)');
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

