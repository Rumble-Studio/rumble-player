import { GenericVisual } from '../../GenericVisual';

export class SimplePrevButton extends GenericVisual {
	protected _kind = 'SimplePrevButton';
	button: HTMLInputElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'prev');
		this.list_of_children = [this.button];
	}

	protected bindHTMLElements() {
		this._playerService.prev()
	}
}

customElements.define('rs-simple-prev-button', SimplePrevButton);
