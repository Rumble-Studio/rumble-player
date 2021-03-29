export class GenericVisual extends HTMLElement {
	percentage = 0;
	protected _kind = 'GenericVisual';
	get kind() {
		return this._kind;
	}

	constructor() {
		super();
		this.createHTMLElements();
		this.bindHTMLElements();
	}

	/** HTML */
	connectedCallback() {
		this.setInnerHTML();
	}
	protected setInnerHTML() {
		// should add children to this
		this.updateVisual();
	}
	protected createHTMLElements() {
		// nothing to do
		console.log('No html element to create for GenericVisual');
	}
	protected bindHTMLElements() {
		this.addEventListener('click', () => {
			console.log('Clicked on ' + this.kind);
		});
	}

	/** logic */
	updatePerPercentage(newPercentage: number) {
		if (newPercentage != this.percentage) {
			console.log(this.kind + ' should be updated at', newPercentage + '%');
			this.percentage = newPercentage;
			this.updateVisual();
		}
	}

	/** visual */
	updateVisual() {
		// should change the visual of the children based on properties like percentage
		// nothing
	}
}

customElements.define('rs-generic-bar', GenericVisual);
