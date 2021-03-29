import { GenericVisual } from '../generic/GenericVisual';

export class LinearHandle extends GenericVisual {
	protected _kind = 'LinearBar';

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

		this.div.onmousedown = (e) => {
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
		this.div.style.left = this.percentage + '%';
	}
}

customElements.define('rs-linear-handle', LinearHandle);
