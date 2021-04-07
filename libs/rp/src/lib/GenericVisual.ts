export class GenericVisual extends HTMLElement {
	public percentage = 0;
	public position = 0;

	protected _kind = 'GenericVisual';
	get kind() {
		return this._kind;
	}

	constructor() {

		super();

    console.log('GENERIC VISUAL CONSTRUCTOR CALLED')

	}

	/** HTML */
	connectedCallback() {
		console.log('%cGENERIC VISUAL CONNECTED CALLBACK CALLED From Parent'+this.kind,'color:blue')
    // const range = document.createRange();
    // range.selectNodeContents(this);
    // range.deleteContents();
    if (!this.hasChildNodes()){
      this.createHTMLElements();
      this.bindHTMLElements();
      this.setInnerHTML();
    }

  }

	protected setInnerHTML() {
		console.log('[GenericVisual](setInnerHTML)', 'nothing to set');
	}

	protected createHTMLElements() {
		console.log('[GenericVisual](createHTMLElements)', 'nothing to create');
	}

	protected bindHTMLElements() {
		console.log('[GenericVisual](bindHTMLElements)', 'nothing to bind');
	}

	/** logic */
	public updatePerPercentage(newPercentage: number) {
		if (newPercentage != this.percentage) {
			this.percentage = newPercentage;
			this.updateVisual();
		}
	}
	public updatePerPosition(newPosition: number) {
		if (newPosition != this.position) {
			this.position = newPosition;
			this.updateVisual();
		}
	}

	/** visual */
	protected updateVisual() {
		console.log('[GenericVisual](updateVisual)', 'nothing to update');
	}
}

customElements.define('rs-generic-bar', GenericVisual);
