import { GenericVisual } from '../GenericVisual';

export class SimplePlayButton extends GenericVisual {
	protected _kind = 'SimplePlayButton';

	button: HTMLButtonElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'play');
	}
	protected setInnerHTML() {
		this.appendChild(this.button);
		this.updateVisual();
	}

	updateVisual() {
		//
	}

	bindHTMLElements() {
		this.addEventListener('click', () => {
			console.log('clicked on simple event')
			// const e = new CustomEvent('play', {
			// 	detail: {},
			// });
			const e  = new Event('play')
			this.dispatchEvent(e);
		});
	}
}

customElements.define('rs-simple-play-button', SimplePlayButton);
