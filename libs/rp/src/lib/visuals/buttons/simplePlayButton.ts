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

  connectedCallback() {
    console.log('%cGENERIC VISUAL CONNECTED CALLBACK CALLED From Children','color:red')
  }

  protected bindHTMLElements() {
		// custom bindings of events
		// in particular, pause button can emit "pause" on click
		this.addEventListener('click', () => {
			const e  = new Event('pause')
			this.dispatchEvent(e);
		});
	}
	protected updateStyle() {
    super.updateStyle();
    this.shadowRoot.appendChild(this.button);
  }

  updateVisual(){
		//
	}
}

customElements.define('rs-simple-pause-button', SimplePauseButton);
