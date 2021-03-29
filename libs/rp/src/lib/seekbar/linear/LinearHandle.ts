import { GenericVisual } from '../generic/GenericVisual';
import { min } from 'rxjs/operators';

export class LinearHandle extends GenericVisual {
	protected _kind = 'LinearHandle';

	div: HTMLDivElement;

	constructor() {
		super();
	}

	protected createHTMLElements() {
		this.div = document.createElement('div');
		this.div.style.backgroundColor = 'yellow';
		this.div.style.height = '15px';
		this.div.style.width = '15px';
		this.div.style.cursor = 'pointer';
		this.div.style.position = 'absolute';
		this.div.style.top = '0px';
		this.style.pointerEvents = 'none'; // TODO : THis line is the most important one

		this.div.onmousedown = (e) => {
			console.log('Mouse down');
			e.preventDefault();
			// get the mouse cursor position at startup:
			let x = e.clientX;
			let y = e.clientY;
			// call a function whenever the cursor moves:
			document.onmousemove = (e) => {
				e.preventDefault();
				// calculate the new cursor position:
				const pos1 = x - e.clientX;
				const pos2 = y - e.clientY;
				x = e.clientX;
				y = e.clientY;
				// set the element's new position:
				this.div.style.left = this.div.offsetLeft - pos1 + 'px';
			};
			document.onmouseup = () => {
				// stop moving when mouse button is released:
				document.onmouseup = null;
				document.onmousemove = null;
			};
		};
	}
	protected setInnerHTML() {
		this.appendChild(this.div);
		this.updateVisual();
	}

	updateVisual() {
		// this.progressDiv.style.width = this.percentage + '%';
		const childWidth = this.div.clientWidth;
		const parentWidth = this.parentElement.clientWidth;
		const maxOffset = parentWidth - childWidth;
		const y = (this.percentage * parentWidth) / 100;
		console.log(maxOffset, y);
		const offset = y < maxOffset ? y : maxOffset;
		console.log('%cOFFSETS,', 'color:blue', childWidth, parentWidth);
		this.div.style.left = offset + 'px';
	}
}

customElements.define('rs-linear-handle', LinearHandle);
