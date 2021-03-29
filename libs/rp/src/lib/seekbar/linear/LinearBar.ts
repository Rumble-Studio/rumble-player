import { GenericVisual } from '../generic/GenericVisual';

export class LinearBar extends GenericVisual {
	protected _kind = 'LinearBar';

	div: HTMLDivElement;
	progressDiv: HTMLDivElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.div = document.createElement('div');
		this.div.style.backgroundColor = 'red';
		this.div.style.height = '15px';

		this.progressDiv = document.createElement('div');
		this.progressDiv.style.width = '0%';
		this.progressDiv.style.height = '100%';
		this.progressDiv.style.backgroundColor = 'blue';
		this.div.style.cursor = 'pointer';
	}
	protected setInnerHTML() {
		this.div.appendChild(this.progressDiv);
		this.appendChild(this.div);
		this.updateVisual();
	}
	protected bindHTMLElements() {}

	updateVisual() {
		this.progressDiv.style.width = this.percentage + '%';
	}
}

customElements.define('rs-linear-bar', LinearBar);
