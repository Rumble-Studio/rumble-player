import { GenericVisual } from "../../GenericVisual";

export class SimplePauseButton extends GenericVisual {
	protected _kind = 'SimplePauseButton';


	constructor() {
		super();
	}

	/** custom HTML elements  */
	button: HTMLInputElement;
	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', 'pause');
	}
	protected setInnerHTML() {
		// custom creation of HTML children
		this.appendChild(this.button);
	}
  connectedCallback() {
    console.log('%cGENERIC VISUAL CONNECTED CALLBACK CALLED From Children','color:red')
  }

  bindHTMLElements() {
		// custom bindings of events
		// in particular, pause button can emit "pause" on click
		this.addEventListener('click', () => {
			const e  = new Event('pause')
			this.dispatchEvent(e);
		});
	}

	updateVisual(){
		//
	}
}

customElements.define('rs-simple-pause-button', SimplePauseButton);
