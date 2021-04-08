export class GenericVisual extends HTMLElement {
	public percentage = 0;
	public position = 0;

	protected _kind = 'GenericVisual';
	protected _shadow : ShadowRoot;
	get kind() {
		return this._kind;
	}

	constructor() {

		super();
    this._shadow = this.attachShadow({mode: 'open'});
    console.log('GENERIC VISUAL CONSTRUCTOR CALLED')

	}

	/** HTML */
	connectedCallback() {
		console.log('%cGENERIC VISUAL CONNECTED CALLBACK CALLED From Parent'+this.kind,'color:blue')
    this.updateStyle()

  }
  adoptedCallback(){
	  console.log('adopted ',this.kind)
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
	protected updateStyle(){
    if (!this._shadow.hasChildNodes()){
      this.createHTMLElements();
      this.bindHTMLElements();}  }
}

customElements.define('rs-generic-bar', GenericVisual);

