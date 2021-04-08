import { GenericVisual } from '../../GenericVisual';

export class SimpleBackwardButton extends GenericVisual {
	protected _kind = 'SimpleBackwardButton';
	button: HTMLInputElement;
  private jump: number;


	constructor(jump=15) {
		super();
    this.jump = jump;
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'backward('+this.jump+'s)');
		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this.button.addEventListener('click', () => {
			const e = new CustomEvent('seekPerPosition', {
				detail: { jump: -this.jump },
			});
			this.dispatchEvent(e);
		});
	}
}

customElements.define('rs-simple-backward-button', SimpleBackwardButton);

