class GenericBar extends HTMLElement {
	percentage: number = 0;

	constructor() {
		super();
	}

	public updatePerPercentage(newPercentage: number) {
		/**
		 * this function should do nothing in the generic class
		 */
		this.percentage = newPercentage;
		console.log('Generic bar should be updated at', newPercentage + '%');
	}
}

class PercentageBar extends GenericBar {
	p: HTMLParagraphElement;

	constructor() {
		super();
		this.createHTMLElements();
	}

	connectedCallback() {
		this.setInnerHTML();
	}

	private createHTMLElements() {
		this.p = document.createElement('p');
	}

	private setInnerHTML() {
		this.appendChild(this.p);
    this.updateVisual();
	}

	updateVisual() {
		this.p.innerText = this.percentage + '%';
	}

	updatePerPercentage(newPercentage: number) {
		console.log('PERCENTAGE bar should be updated at', newPercentage + '%');
		this.percentage = newPercentage;
		this.updateVisual();
	}
}

class GenericHandle extends HTMLElement {
	percentage: number = 0;

	constructor() {
		super();
	}

	public updatePerPercentage(newPercentage: number) {
		/**
		 * this function should do nothing in the generic class
		 */
		this.percentage = newPercentage;
		console.log('Generic handle should be updated at', newPercentage + '%');
	}
}

export class GenericSeekbar extends HTMLElement {
	/**
	 *
	 *  This class will:
	 * - accept a progress and update the visual
	 * - emit when seeked
	 *
	 *
	 * A seekbar will always have a
	 * support object (the bar) and a
	 * mobile object (the handle)
	 *
	 *
	 * When handle is moved: we emit the new position
	 * when the bar is clicked: we emit the new position
	 *
	 *
	 * WHen a new position is set:
	 *  we update the position of the handle on the bar
	 */

	private _percentage: number = 0;
	set percentage(newPercentage: number) {
		this._percentage = newPercentage;
		this._handle.updatePerPercentage(newPercentage);
		this._bar.updatePerPercentage(newPercentage);
	}
	get percentage() {
		return this._percentage;
	}

	protected _bar: GenericBar;
	private _handle: GenericHandle;

	constructor() {
		super();
		this._bar = new GenericBar();
		this._handle = new GenericHandle();
	}

	changeBar(newBar: GenericBar) {
		this._bar = newBar;
	}
	changeHandle(newHandle: GenericHandle) {
		this._handle = newHandle;
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

export class PercentageSeekBar extends GenericSeekbar {
	protected _bar: PercentageBar;
	constructor() {
		super();
	}
}

// export class LinearSeekBar extends GenericSeekbar {
// 	// TODO: Utiliser la classe CircularHandle et RectangleBar
// 	// Bar properties
// 	protected barWidth;
// 	protected bar: LinearBar;
// 	// Handle properties
// 	private handleRadius: number;
// 	private handleColor: string;

// 	constructor(barThickness?: number, barColor?: string, barWidth?: number) {
// 		super();
// 		this.barThickness = barThickness ? barThickness : 3;
// 		this.barColor = barColor ? barColor : 'black';
// 		this.barWidth = barWidth ? barWidth : 250;
// 		this.bar = new LinearBar(this.barThickness, this.barColor, this.barWidth);
// 		this.bar.addEventListener('seekTo', (evt: CustomEvent) => {
// 			console.log(
// 				'%cLINEAR SEEKBAR GOT SEEK EVENT',
// 				'color:red',
// 				evt.detail.percentage
// 			);
// 			super.seek(evt.detail.percentage);
// 		});
// 	}
// }

// export class CircularSeekBar extends GenericSeekbar {
// 	protected bar: CircularBar;

// 	constructor(
// 		innerBarRadius?: number,
// 		outerBarRadius?: number,
// 		barColor?: string
// 	) {
// 		super();
// 		this.barColor = barColor ? barColor : 'black';
// 		innerBarRadius = innerBarRadius ? innerBarRadius : 140;
// 		outerBarRadius = outerBarRadius ? outerBarRadius : 150;
// 		this.bar = new CircularBar(innerBarRadius, outerBarRadius, this.barColor);
// 		this.bar.addEventListener('seekTo', (evt: CustomEvent) => {
// 			console.log(
// 				'%cLINEAR SEEKBAR GOT SEEK EVENT',
// 				'color:red',
// 				evt.detail.percentage
// 			);
// 			super.seek(evt.detail.percentage);
// 		});
// 	}
// 	public setBarProgression(value: number) {
// 		this.bar.updateProgress(value);
// 	}
// }

// export class LinearBar extends GenericBar {
// 	private div: HTMLDivElement;
// 	private progressDiv: HTMLDivElement;

// 	set progress(value: number) {
// 		console.log('received value for progress ', value);
// 		this.progressDiv.style.width = value.toString() + '%';
// 	}
// 	constructor(barThickness: number, barColor: string, barWidth: number) {
// 		super(barThickness, barColor, barWidth);
// 	}
// 	connectedCallback() {
// 		this.setInnerHTML();
// 		this.progress = 0;
// 	}

// 	protected setInnerHTML() {
// 		this.div = document.createElement('div');
// 		this.progressDiv = document.createElement('div');
// 		this.progressDiv.style.height = '100%';
// 		this.progressDiv.style.backgroundColor = 'blue';
// 		this.div.style.cursor = 'pointer';
// 		this.div.appendChild(this.progressDiv);
// 		this.appendChild(this.div);
// 		this.updateStyle();
// 	}

// 	protected clickCallback(event: MouseEvent) {
// 		const width = this.div.offsetWidth;
// 		const x = event.offsetX < 0 ? 0 : event.offsetX; // Get the horizontal coordinate
// 		const percentage = (100 * x) / width;
// 		super.seek(percentage);
// 		this.progress = percentage;
// 	}

// 	protected updateStyle() {
// 		this.div.style.marginTop = '10px';
// 		this.div.style.width = '300px';
// 		this.div.style.height = this.barThickness.toString() + 'px';
// 		this.div.style.backgroundColor = this.barColor;
// 		this.div.onclick = (e) => {
// 			this.clickCallback(e);
// 		};
// 	}
// }
// export class CircularBar extends GenericBar {
// 	private div: HTMLDivElement;
// 	private progressSVG: SVGSVGElement;
// 	private emptyCircle: SVGCircleElement;
// 	private filledCircle: SVGCircleElement;

// 	constructor(
// 		innerBarRadius: number,
// 		outerBarRadius: number,
// 		barColor: string
// 	) {
// 		const barThickness = outerBarRadius - innerBarRadius;
// 		super(barThickness, barColor, innerBarRadius);
// 	}

// 	connectedCallback() {
// 		this.setInnerHTML();
// 		this.progress = 0;
// 	}

// 	protected setInnerHTML() {
// 		this.div = document.createElement('div');
// 		this.progressSVG = document.createElementNS(
// 			'http://www.w3.org/2000/svg',
// 			'svg'
// 		);
// 		this.emptyCircle = document.createElementNS(
// 			'http://www.w3.org/2000/svg',
// 			'circle'
// 		);
// 		this.filledCircle = document.createElementNS(
// 			'http://www.w3.org/2000/svg',
// 			'circle'
// 		);

// 		this.progressSVG.appendChild(this.emptyCircle);
// 		this.progressSVG.appendChild(this.filledCircle);
// 		this.div.appendChild(this.progressSVG);
// 		this.appendChild(this.div);

// 		this.updateStyle();
// 	}

// 	protected clickCallback(event: MouseEvent) {
// 		console.log('Click');
// 		const width = this.div.offsetWidth;
// 		const x = event.offsetX < 0 ? 0 : event.offsetX; // Get the horizontal coordinate
// 		const y = event.offsetY < 0 ? 0 : event.offsetY; // Get the vertical coordinate
// 		const minBorder = Math.pow(this.barWidth - this.barThickness * 2, 2);
// 		const maxBorder = Math.pow(this.barWidth - this.barThickness, 2);
// 		console.log('Click', minBorder, maxBorder);
// 		console.log('Click', x * x, y * y, x * x + y * y);
// 	}

// 	protected updateStyle() {
// 		this.div.style.position = 'relative';
// 		this.div.style.width = this.barWidth.toString() + 'px';
// 		this.div.style.height = this.barWidth.toString() + 'px';
// 		this.div.style.borderRadius = '50%';
// 		this.div.style.boxShadow = 'inset 0 0 50px #000';
// 		this.div.style.backgroundColor = '#222';
// 		this.div.style.zIndex = '1000';
// 		this.div.style.margin = '10px';

// 		this.progressSVG.style.position = 'relative';
// 		this.progressSVG.style.width = this.barWidth.toString() + 'px';
// 		this.progressSVG.style.height = this.barWidth.toString() + 'px';
// 		this.progressSVG.style.zIndex = '1000';
// 		this.progressSVG.style.borderRadius = '50%';
// 		this.progressSVG.style.backgroundColor = 'white';
// 		this.progressSVG.style.transform = 'rotate(-90deg)';
// 		this.progressSVG.setAttribute('stroke-dasharray', 10 + ' 999');
// 		this.progressSVG.setAttribute('stroke-linecap', 'round');
// 		this.progressSVG.style.cursor = 'pointer';
// 		// This code below will be used to set percentage
// 		// const circumference = 2* Math.PI * (this.barWidth-this.barThickness)/2
// 		// const percent = 100
// 		// const draw = percent * circumference / 100
// 		// this.progressSVG.setAttribute('stroke-dasharray', draw + ' 999')

// 		this.emptyCircle.style.width = '100%';
// 		this.emptyCircle.style.height = '100%';
// 		this.emptyCircle.style.fill = 'gray';
// 		this.emptyCircle.style.stroke = 'gray';
// 		this.emptyCircle.style.strokeWidth = '0px';
// 		this.emptyCircle.style.transform = 'translate(5px, 5px)';
// 		this.emptyCircle.setAttribute(
// 			'cx',
// 			((this.barWidth - this.barThickness) / 2).toString()
// 		);
// 		this.emptyCircle.setAttribute(
// 			'cy',
// 			((this.barWidth - this.barThickness) / 2).toString()
// 		);
// 		this.emptyCircle.setAttribute(
// 			'r',
// 			((this.barWidth - this.barThickness * 2) / 2).toString()
// 		);
// 		this.emptyCircle.style.cursor = 'default';

// 		this.filledCircle.style.width = '100%';
// 		this.filledCircle.style.height = '100%';
// 		this.filledCircle.style.fill = 'none';
// 		this.filledCircle.style.stroke = this.barColor;
// 		this.filledCircle.style.strokeWidth = '10px';
// 		this.filledCircle.style.transform = 'translate(5px, 5px)';
// 		this.filledCircle.setAttribute(
// 			'cx',
// 			((this.barWidth - this.barThickness) / 2).toString()
// 		);
// 		this.filledCircle.setAttribute(
// 			'cy',
// 			((this.barWidth - this.barThickness) / 2).toString()
// 		);
// 		this.filledCircle.setAttribute(
// 			'r',
// 			((this.barWidth - this.barThickness) / 2).toString()
// 		);
// 		this.filledCircle.style.cursor = 'pointer';

// 		this.div.onclick = (e) => {
// 			this.clickCallback(e);
// 		};
// 		//
// 	}
// 	updateProgress(percentage: number) {
// 		const circumference =
// 			(2 * Math.PI * (this.barWidth - this.barThickness)) / 2;
// 		const draw = (percentage * circumference) / 100;
// 		this.progressSVG.setAttribute('stroke-dasharray', draw + ' 999');
// 	}
// }

// class FunkyBar {}

// class CircularHandle {}
// class FunkyHandle {}

customElements.define('rs-generic-seekbar', GenericSeekbar);
customElements.define('rs-percentage-seekbar', PercentageSeekBar);
// customElements.define('rs-percentage-seekbar', GenericSeekbar);
// customElements.define('rs-linear-seekbar', LinearSeekBar);
// customElements.define('rs-circular-seekbar', CircularSeekBar);

customElements.define('rs-generic-bar', GenericBar);
customElements.define('rs-generic-handle', GenericHandle);
// customElements.define('rs-linearbar', LinearBar);
// customElements.define('rs-circularbar', CircularBar);
