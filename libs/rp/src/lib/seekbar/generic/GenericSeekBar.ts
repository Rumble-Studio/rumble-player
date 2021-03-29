import { GenericVisual } from './GenericVisual';

export class GenericSeekbar extends HTMLElement {
	protected _kind = 'genericSeekbar';
	get kind() {
		return this._kind;
	}
	private _percentage = 0;
	set percentage(newPercentage: number) {
		this._percentage = newPercentage;
		this.visuals.forEach((v) => v.updatePerPercentage(newPercentage));
	}
	get percentage() {
		return this._percentage;
	}

	public visuals: GenericVisual[];

	constructor() {
		super();
		this.createHTMLElements();
	}

	/** HTML */
	protected createHTMLElements() {
		// for percentageBar we only have a "p" element
		this.style.position = 'relative';
		this.style.background = 'black';
		this.style.height = '50px';
		this.style.width = '100%';
		this.style.display = 'block';
		this.fillVisuals();
	}

	protected fillVisuals() {
		this.visuals = [new GenericVisual()];
	}

	connectedCallback() {
		this.setInnerHTML();
	}
	protected setInnerHTML() {
		// should add children to this
		this.visuals.forEach((v) => {
			this.appendChild(v);
		});
	}

	changeVisuals(visuals: GenericVisual[]) {
		this.visuals = visuals;
	}

	updatePerPercentage(newPercentage: number) {
		this.percentage = newPercentage;
	}

	updatePerPosition(newPosition: number) {
		// this.percentage = newPercentage;
		// console.log('New position is not used per Generic Seekbar', newPosition);
	}

	emitPercentage(percentage: number) {
		const e = new CustomEvent('seekPerPercentage', {
			detail: { percentage },
		});
		this.dispatchEvent(e);
	}
}

customElements.define('rs-generic-seekbar', GenericSeekbar);
