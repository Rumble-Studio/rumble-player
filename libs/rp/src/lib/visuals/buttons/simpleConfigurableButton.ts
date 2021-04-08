import { GenericVisual } from '../../GenericVisual';

export class SimpleConfigurableButton extends GenericVisual {
	protected _kind = 'SimpleConfigurableButton';

	private eventToEmit: string;

	constructor(eventToEmit: string) {
		super();
		this.eventToEmit = eventToEmit;
		this.button.setAttribute('value', this.eventToEmit);
	}

	/** custom HTML elements  */
	button: HTMLInputElement;
	protected createHTMLElements() {
		this.button = document.createElement('input');
		this.button.setAttribute('type', 'button');
		this.button.setAttribute('value', this.eventToEmit);
	}

	bindHTMLElements() {
		// custom bindings of events
		// in particular, configurable button can emit "configurable" on click
		this.addEventListener('click', () => {
			const e = new Event(this.eventToEmit);
			this.dispatchEvent(e);
		});
	}
  protected updateStyle() {
    super.updateStyle();
    this.shadowRoot.appendChild(this.button);
  }

	updateVisual() {
		//
	}
}

customElements.define(
	'rs-simple-configurable-button',
	SimpleConfigurableButton
);
