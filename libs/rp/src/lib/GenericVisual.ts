export class GenericVisual extends HTMLElement {
	private _percentage = 0;
	set percentage(newPercentage: number) {
		this._percentage = newPercentage;
		this.visuals.forEach((v) => v.updatePerPercentage(newPercentage));
	}
	get percentage() {
		return this._percentage;
	}

	visuals:GenericVisual[];
	
	position = 0;
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
			this.percentage = newPercentage;
			this.updateVisual();
		}
	}

	updatePerPosition(newPosition: number) {
		if (newPosition != this.position) {
			this.position = newPosition;
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
